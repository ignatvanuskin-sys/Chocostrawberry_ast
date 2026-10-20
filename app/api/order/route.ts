import { NextResponse } from "next/server";
import { formatPrice, getProducts } from "../../lib/products";
import {
  appendOrder,
  escapeHtml,
  makeOrderId,
  notifyTelegram,
  type StoredOrder,
} from "../../lib/server-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type IncomingItem = { slug: string; optionId: string; qty: number; message?: string; date?: string };

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный JSON" }, { status: 400 });
  }

  const data = body as {
    customer?: Record<string, string>;
    items?: IncomingItem[];
  };

  const customer = data.customer ?? {};
  const items = Array.isArray(data.items) ? data.items : [];

  if (!customer.name || customer.name.trim().length < 2) {
    return NextResponse.json({ ok: false, error: "Укажите имя" }, { status: 422 });
  }
  if (!customer.phone || customer.phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ ok: false, error: "Укажите телефон" }, { status: 422 });
  }
  if (customer.method === "delivery" && (!customer.address || customer.address.trim().length < 5)) {
    return NextResponse.json({ ok: false, error: "Укажите адрес доставки" }, { status: 422 });
  }
  if (items.length === 0) {
    return NextResponse.json({ ok: false, error: "Корзина пуста" }, { status: 422 });
  }

  // Стоимость пересчитывается на сервере — цены из браузера не принимаются.
  const products = getProducts();
  const lines = items.map((item) => {
    const product = products.find((p) => p.slug === item.slug);
    const option = product?.options.find((o) => o.id === item.optionId);
    if (!product || !option) return null;
    const qty = Math.max(1, Math.min(99, Number(item.qty) || 1));
    return {
      slug: product.slug,
      name: product.name,
      optionLabel: option.label,
      portions: option.portions,
      qty,
      price: option.price,
      sum: option.price * qty,
      message: item.message ?? "",
      date: item.date ?? "",
    };
  });

  if (lines.some((l) => l === null)) {
    return NextResponse.json({ ok: false, error: "Товар недоступен" }, { status: 422 });
  }

  const total = lines.reduce((sum, line) => sum + (line?.sum ?? 0), 0);
  const orderId = makeOrderId("CS");

  const text = [
    `<b>Новый заказ ${orderId}</b>`,
    "",
    ...lines.map(
      (l) =>
        `• ${escapeHtml(l!.name)} — ${escapeHtml(l!.optionLabel)} × ${l!.qty} = ${formatPrice(
          l!.sum
        )}${l!.message ? `\n   надпись: ${escapeHtml(l!.message)}` : ""}${
          l!.date ? `\n   дата: ${escapeHtml(l!.date)}` : ""
        }`
    ),
    "",
    `<b>Итого: ${formatPrice(total)}</b>`,
    "",
    `Имя: ${escapeHtml(customer.name)}`,
    `Телефон: ${escapeHtml(customer.phone)}`,
    `Получение: ${customer.method === "delivery" ? "доставка" : "самовывоз"}`,
    customer.address ? `Адрес: ${escapeHtml(customer.address)}` : "",
    customer.date ? `Дата: ${escapeHtml(customer.date)}` : "",
    customer.time ? `Время: ${escapeHtml(customer.time)}` : "",
    customer.comment ? `Комментарий: ${escapeHtml(customer.comment)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const notified = await notifyTelegram(text);

  const order: StoredOrder = {
    id: orderId,
    createdAt: new Date().toISOString(),
    type: "order",
    status: "new",
    customer: { ...customer },
    items: lines.filter(Boolean) as Array<Record<string, unknown>>,
    total,
    notified,
  };

  let stored = true;
  try {
    appendOrder(order);
  } catch {
    stored = false;
  }

  return NextResponse.json({
    ok: true,
    orderId,
    total,
    notified,
    stored,
    // если Telegram не настроен — заказ можно отправить в WhatsApp одной кнопкой
    requiresWhatsapp: !notified,
  });
}

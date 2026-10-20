import { NextResponse } from "next/server";
import {
  appendOrder,
  escapeHtml,
  makeOrderId,
  notifyTelegram,
  type StoredOrder,
} from "../../lib/server-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный JSON" }, { status: 400 });
  }

  const str = (key: string) => (typeof body[key] === "string" ? (body[key] as string).trim() : "");
  const name = str("name");
  const phone = str("phone");
  const occasion = str("occasion");
  const weight = str("weight");
  const date = str("date");

  if (name.length < 2) return NextResponse.json({ ok: false, error: "Укажите имя" }, { status: 422 });
  if (phone.replace(/\D/g, "").length < 11)
    return NextResponse.json({ ok: false, error: "Укажите телефон" }, { status: 422 });
  if (!occasion) return NextResponse.json({ ok: false, error: "Выберите повод" }, { status: 422 });
  if (!weight) return NextResponse.json({ ok: false, error: "Укажите размер" }, { status: 422 });
  if (!date) return NextResponse.json({ ok: false, error: "Выберите дату" }, { status: 422 });

  const flavors = Array.isArray(body.flavors) ? (body.flavors as string[]).join(", ") : "";
  const id = makeOrderId("CSC");

  const text = [
    `<b>Заявка на набор ${id}</b>`,
    "",
    `Повод: ${escapeHtml(occasion)}`,
    `Размер: ${escapeHtml(weight)}`,
    `Дата: ${escapeHtml(date)}`,
    flavors ? `Шоколад и начинка: ${escapeHtml(flavors)}` : "",
    str("company") ? `Компания: ${escapeHtml(str("company"))}` : "",
    str("inscription") ? `Надпись: ${escapeHtml(str("inscription"))}` : "",
    str("design") ? `Дизайн: ${escapeHtml(str("design"))}` : "",
    str("link") ? `Пример: ${escapeHtml(str("link"))}` : "",
    str("budget") ? `Бюджет: ${escapeHtml(str("budget"))}` : "",
    "",
    `Имя: ${escapeHtml(name)}`,
    `Телефон: ${escapeHtml(phone)}`,
  ]
    .filter(Boolean)
    .join("\n");

  const notified = await notifyTelegram(text);

  const order: StoredOrder = {
    id,
    createdAt: new Date().toISOString(),
    type: "custom",
    status: "new",
    customer: { name, phone },
    custom: {
      occasion,
      weight,
      date,
      flavors,
      company: str("company"),
      inscription: str("inscription"),
      design: str("design"),
      link: str("link"),
      budget: str("budget"),
    },
    notified,
  };

  let stored = true;
  try {
    appendOrder(order);
  } catch {
    stored = false;
  }

  return NextResponse.json({ ok: true, id, notified, stored, requiresWhatsapp: !notified });
}

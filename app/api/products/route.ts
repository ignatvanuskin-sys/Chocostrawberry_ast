import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getCatalog } from "../../lib/products";
import { isAdmin } from "../../lib/server-store";
import type { Product } from "../../lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILE = path.join(process.cwd(), "data", "products.json");

function write(catalog: unknown) {
  fs.writeFileSync(FILE, JSON.stringify(catalog, null, 2), "utf8");
}

export async function GET() {
  return NextResponse.json(getCatalog(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PATCH(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { ok: false, error: "Нет доступа. Укажите ADMIN_TOKEN в переменных окружения и введите его в панели." },
      { status: 401 }
    );
  }

  const body = (await request.json()) as {
    slug?: string;
    patch?: Partial<Product> & { firstOptionPrice?: number };
  };

  if (!body.slug || !body.patch) {
    return NextResponse.json({ ok: false, error: "Нужны slug и patch" }, { status: 422 });
  }

  const catalog = getCatalog();
  const index = catalog.products.findIndex((p) => p.slug === body.slug);
  if (index === -1) {
    return NextResponse.json({ ok: false, error: "Товар не найден" }, { status: 404 });
  }

  const { firstOptionPrice, ...patch } = body.patch;
  const product = { ...catalog.products[index], ...patch };

  if (typeof firstOptionPrice === "number" && Number.isFinite(firstOptionPrice)) {
    product.options = product.options.map((o, i) =>
      i === 0 ? { ...o, price: Math.max(0, Math.round(firstOptionPrice)) } : o
    );
  }

  catalog.products[index] = product;

  try {
    write(catalog);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Файл каталога недоступен для записи (на serverless нужен внешний storage)." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, product });
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Нет доступа" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Product>;
  if (!body.name || !body.slug) {
    return NextResponse.json({ ok: false, error: "Нужны name и slug" }, { status: 422 });
  }

  const catalog = getCatalog();
  if (catalog.products.some((p) => p.slug === body.slug)) {
    return NextResponse.json({ ok: false, error: "Такой slug уже есть" }, { status: 409 });
  }

  const product: Product = {
    slug: body.slug,
    name: body.name,
    kind: body.kind ?? "Набор",
    categories: body.categories?.length ? body.categories : ["cakes"],
    subtitle: body.subtitle ?? "",
    description: body.description ?? "",
    options: body.options?.length
      ? body.options
      : [{ id: "1", label: "1 кг", weightKg: 1, portions: "8–10 порций", price: 15000 }],
    images: body.images?.length ? body.images : [{ src: "/images/products/cake-naked.jpg", alt: body.name }],
    badges: body.badges ?? [],
    occasions: body.occasions ?? [],
    style: body.style ?? "",
    createdAt: new Date().toISOString().slice(0, 10),
    customizable: body.customizable ?? true,
  };

  catalog.products.unshift(product);

  try {
    write(catalog);
  } catch {
    return NextResponse.json({ ok: false, error: "Файл каталога недоступен для записи" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, product });
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Нет доступа" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ ok: false, error: "Нужен slug" }, { status: 422 });

  const catalog = getCatalog();
  const next = catalog.products.filter((p) => p.slug !== slug);
  if (next.length === catalog.products.length) {
    return NextResponse.json({ ok: false, error: "Товар не найден" }, { status: 404 });
  }
  catalog.products = next;

  try {
    write(catalog);
  } catch {
    return NextResponse.json({ ok: false, error: "Файл каталога недоступен для записи" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

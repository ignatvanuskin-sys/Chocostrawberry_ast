import fs from "node:fs";
import path from "node:path";
import type { CatalogData, Product } from "./types";
import { formatPrice, formatWeight, priceFrom, priceTo } from "./format";

export { formatPrice, formatWeight, priceFrom, priceTo };

const FILE = path.join(process.cwd(), "data", "products.json");

/** Читает каталог с диска при каждом запросе — правки из /admin видны сразу. */
export function getCatalog(): CatalogData {
  const raw = fs.readFileSync(FILE, "utf8");
  return JSON.parse(raw) as CatalogData;
}

export function getProducts(): Product[] {
  return getCatalog().products;
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return getCatalog().categories.find((c) => c.slug === slug);
}

export function inCategory(product: Product, slug?: string): boolean {
  if (!slug) return true;
  return product.categories.includes(slug);
}

export function categoryCount(slug: string): number {
  return getProducts().filter((p) => p.categories.includes(slug)).length;
}

/** Похожие товары: сначала общие категории, потом просто другие позиции. */
export function relatedProducts(product: Product, limit = 5): Product[] {
  const all = getProducts().filter((p) => p.slug !== product.slug);
  const scored = all.map((p) => {
    const shared = p.categories.filter((c) => product.categories.includes(c)).length;
    return { p, shared };
  });
  scored.sort((a, b) => b.shared - a.shared || (a.p.createdAt < b.p.createdAt ? 1 : -1));
  return scored.slice(0, limit).map((s) => s.p);
}

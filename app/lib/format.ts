/** Форматирование и расчёты, безопасные для клиентских компонентов (без node:fs). */
import type { Product } from "./types";

export function priceFrom(product: Product): number {
  return Math.min(...product.options.map((o) => o.price));
}

export function priceTo(product: Product): number {
  return Math.max(...product.options.map((o) => o.price));
}

export function formatPrice(value: number): string {
  if (!value || value <= 0) return "по запросу";
  return new Intl.NumberFormat("ru-RU").format(Math.round(value)) + " ₸";
}

export function formatWeight(kg: number): string {
  return String(kg).replace(".", ",") + " кг";
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
}

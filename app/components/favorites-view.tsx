"use client";

import Link from "next/link";
import type { Product } from "../lib/types";
import { useStore } from "./store";
import { ProductCard } from "./product-card";
import { IconArrowRight } from "./icons";

export function FavoritesView({ products }: { products: Product[] }) {
  const { favorites, hydrated } = useStore();
  const items = products.filter((p) => favorites.includes(p.slug));

  if (!hydrated) return <p className="meta">Загружаем избранное…</p>;

  if (items.length === 0) {
    return (
      <div className="empty">
        <span className="eyebrow">Избранное пусто</span>
        <h3>Сохраняйте то, что понравилось</h3>
        <p>
          Нажмите на сердечко на странице товара — изделие появится здесь и сохранится на этом
          устройстве.
        </p>
        <Link href="/catalog" className="btn btn--primary">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid-products">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      <div className="load-more">
        <Link href="/catalog" className="link-arrow">
          Добавить ещё <IconArrowRight size={14} />
        </Link>
      </div>
    </>
  );
}

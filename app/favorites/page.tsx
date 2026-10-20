import Link from "next/link";
import type { Metadata } from "next";
import { getProducts } from "../lib/products";
import { FavoritesView } from "../components/favorites-view";

export const metadata: Metadata = {
  title: "Избранное",
  description: "Сохранённые наборы Chocostrawberry.",
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  const products = getProducts();

  return (
    <div className="page container">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span aria-hidden>/</span>
        <span>Избранное</span>
      </nav>

      <header className="page-head">
        <div>
          <span className="eyebrow">Список желаний</span>
          <h1 style={{ marginTop: 10 }}>Избранное</h1>
        </div>
        <p className="page-head__aside">
          Список хранится в этом браузере. Его можно показать кондитеру — мы поможем собрать заказ.
        </p>
      </header>

      <FavoritesView products={products} />
    </div>
  );
}

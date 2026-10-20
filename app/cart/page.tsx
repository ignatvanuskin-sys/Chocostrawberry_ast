import Link from "next/link";
import type { Metadata } from "next";
import { CartView } from "../components/cart-view";

export const metadata: Metadata = {
  title: "Корзина",
  description: "Выбранные наборы клубники и фиников в шоколаде Chocostrawberry.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="page container">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span aria-hidden>/</span>
        <span>Корзина</span>
      </nav>

      <header className="page-head">
        <div>
          <span className="eyebrow">Заказ</span>
          <h1 style={{ marginTop: 10 }}>Корзина</h1>
        </div>
        <p className="page-head__aside">
          Проверьте состав, размер и надписи. Дату и время получения подтвердим после оформления.
        </p>
      </header>

      <CartView />
    </div>
  );
}

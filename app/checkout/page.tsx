import Link from "next/link";
import type { Metadata } from "next";
import { CheckoutForm } from "../components/checkout-form";

export const metadata: Metadata = {
  title: "Оформление заказа",
  description: "Оформление заказа Chocostrawberry с доставкой по Астане или самовывозом.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="page container">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span aria-hidden>/</span>
        <Link href="/cart">Корзина</Link>
        <span aria-hidden>/</span>
        <span>Оформление</span>
      </nav>

      <header className="page-head">
        <div>
          <span className="eyebrow">Шаг 2 из 2</span>
          <h1 style={{ marginTop: 10 }}>Оформление заказа</h1>
        </div>
        <p className="page-head__aside">
          Оставьте контакты и пожелания. Оплата на сайте не проводится — сначала согласуем детали.
        </p>
      </header>

      <CheckoutForm />
    </div>
  );
}

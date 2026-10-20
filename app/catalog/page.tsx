import Link from "next/link";
import type { Metadata } from "next";
import { getCatalog } from "../lib/products";
import { CatalogView } from "../components/catalog-view";
import { site } from "../lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Каталог наборов",
  description:
    "Каталог Chocostrawberry: клубника и финики в бельгийском шоколаде, подарочные наборы, сердца и букеты в Астане. Фильтры по цене, размеру и поводу.",
  alternates: { canonical: "/catalog" },
};

export default function CatalogPage() {
  const { products, categories } = getCatalog();

  return (
    <div className="page container">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span aria-hidden>/</span>
        <span>Каталог</span>
      </nav>

      <header className="page-head">
        <div>
          <span className="eyebrow">Каталог</span>
          <h1 style={{ marginTop: 10 }}>Клубника и финики</h1>
        </div>
        <p className="page-head__aside">
          {products.length} позиций в каталоге. Цены — по актуальному прайсу компании; наличие и
          итоговую стоимость подтверждает кондитер.
        </p>
      </header>

      <CatalogView products={products} categories={categories} />

      <section className="section section--tight" style={{ paddingTop: 56 }}>
        <div className="delivery">
          <div className="delivery__col">
            <div className="eyebrow">Не нашли набор?</div>
            <h2 style={{ fontSize: "var(--fs-h3)" }}>Соберём индивидуально</h2>
            <p className="lead" style={{ fontSize: 14 }}>
              Опишите повод и пожелания — кондитер предложит состав, размер и стоимость.
            </p>
            <Link href="/custom" className="btn btn--primary" style={{ alignSelf: "flex-start" }}>
              Оставить заявку
            </Link>
          </div>
          <div className="delivery__col">
            <div className="eyebrow">Нужна помощь?</div>
            <h2 style={{ fontSize: "var(--fs-h3)" }}>Напишите в WhatsApp</h2>
            <p className="lead" style={{ fontSize: 14 }}>
              Подскажем по составу, срокам и доставке. Работаем {site.hours.toLowerCase()}.
            </p>
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost"
              style={{ alignSelf: "flex-start" }}
            >
              Открыть чат
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

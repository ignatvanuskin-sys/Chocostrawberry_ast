import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CustomForm } from "../components/custom-form";
import { site } from "../lib/site";

export const metadata: Metadata = {
  title: "Набор на заказ в Астане",
  description:
    "Индивидуальный набор клубники и фиников в шоколаде в Астане: повод, размер, шоколад, декор и надпись. Заявка на согласование с кондитером Chocostrawberry.",
  alternates: { canonical: "/custom" },
};

export default function CustomPage() {
  return (
    <div className="page container">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span aria-hidden>/</span>
        <span>Набор на заказ</span>
      </nav>

      <header className="custom-head">
        <div>
          <span className="eyebrow">Индивидуальный заказ</span>
          <h1 style={{ marginTop: 12 }}>
            Набор,
            <br />
            которого
            <br />
            <em>ещё не было</em>
          </h1>
          <p className="lead" style={{ marginTop: 18 }}>
            Расскажите о поводе, размере и оформлении — кондитер предложит состав и стоимость.
            Заявка ни к чему не обязывает: сначала согласуем детали и дату.
          </p>
          <p className="meta" style={{ marginTop: 14 }}>
            Ответим в любое время · {site.hours}
          </p>
        </div>
        <div className="custom-head__media">
          <Image
            src="/images/products/nabor-i-love-you.jpg"
            alt="Большой набор-сердце с клубникой в шоколаде"
            width={900}
            height={562}
            priority
          />
        </div>
      </header>

      <CustomForm />

      <section className="section section--tight">
        <div className="delivery">
          <div className="delivery__col">
            <div className="eyebrow">Что уточняем</div>
            <h2 style={{ fontSize: "var(--fs-h3)" }}>Детали, которые влияют на цену</h2>
            <div>
              <div className="delivery__row">
                <span>Размер</span>
                <span>количество ягод и фиников</span>
              </div>
              <div className="delivery__row">
                <span>Шоколад</span>
                <span>молочный, тёмный, белый</span>
              </div>
              <div className="delivery__row">
                <span>Декор</span>
                <span>упаковка, лента, надпись</span>
              </div>
              <div className="delivery__row">
                <span>Срок</span>
                <span>дата и срочность</span>
              </div>
            </div>
          </div>
          <div className="delivery__col">
            <div className="eyebrow">Быстрее всего</div>
            <h2 style={{ fontSize: "var(--fs-h3)" }}>Написать в WhatsApp</h2>
            <p className="lead" style={{ fontSize: 14 }}>
              Пришлите фотографию-пример и дату — так кондитер быстрее оценит задачу. Ежедневно,
              круглосуточно.
            </p>
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
              style={{ alignSelf: "flex-start" }}
            >
              Открыть WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

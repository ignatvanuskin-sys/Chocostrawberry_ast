import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { site } from "../lib/site";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "Chocostrawberry — клубника и финики в бельгийском шоколаде в Астане. Подарочные наборы, сердца и букеты, доставка по городу и самовывоз.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="page container">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span aria-hidden>/</span>
        <span>О нас</span>
      </nav>

      <header className="page-head">
        <div>
          <span className="eyebrow">О нас</span>
          <h1 style={{ marginTop: 10 }}>
            Мастерская
            <br />
            сладких подарков
          </h1>
        </div>
        <p className="page-head__aside">
          Наборы, сердца и букеты из свежей клубники, финики в бельгийском шоколаде. Работаем
          круглосуточно, доставляем по Астане.
        </p>
      </header>

      <div className="two-col">
        <aside className="two-col__aside">
          <span>Ассортимент</span>
          <span>Упаковка</span>
          <span>Как заказать</span>
          <span>Контакты</span>
        </aside>

        <div className="prose">
          <p>
            Chocostrawberry — мастерская клубники и фиников в шоколаде в Астане. Мы собираем
            подарочные наборы, сердца и букеты: свежие ягоды, бельгийский шоколад, аккуратная
            упаковка и открытка к поводу.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "8px 0 4px" }}>
            <div style={{ position: "relative", aspectRatio: "4 / 5", overflow: "hidden" }}>
              <Image
                src="/images/products/nabor-m.jpg"
                alt="Набор клубники в шоколаде"
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
              />
            </div>
            <div style={{ position: "relative", aspectRatio: "4 / 5", overflow: "hidden" }}>
              <Image
                src="/images/products/premium-serdce-s.jpg"
                alt="Сердце из клубники в шоколаде"
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
              />
            </div>
          </div>

          <h2>Ассортимент</h2>
          <p>
            В каталоге — наборы клубники в шоколаде от мини-формата до больших сетов, сердца,
            съедобные букеты и финики в шоколаде. Для особого повода можно собрать индивидуальный
            набор или подарочный бокс.
          </p>
          <ul>
            <li>
              <Link href="/catalog/sets">Наборы</Link> — клубника в молочном, тёмном и белом
              шоколаде.
            </li>
            <li>
              <Link href="/catalog/hearts">Сердца</Link> — от компактных до больших наборов на
              свадьбу и годовщину.
            </li>
            <li>
              <Link href="/catalog/bouquets">Букеты</Link> — съедобный букет из клубники с
              упаковкой и лентой.
            </li>
            <li>
              <Link href="/catalog/dates">Финики в шоколаде</Link> — с орехом, миндалём и
              фисташковой начинкой.
            </li>
            <li>
              <Link href="/catalog/boxes">Подарочные боксы</Link> — состав и оформление под ваш
              повод.
            </li>
          </ul>

          <h2>Упаковка</h2>
          <p>
            Наборы отдаём в подарочных коробках, дополняем лентой и открыткой. Для индивидуальных
            заказов можно обсудить цвет упаковки и текст поздравления. Фотографию-пример пришлите
            в WhatsApp — так проще согласовать оформление.
          </p>

          <h2>Как заказать</h2>
          <p>
            Готовые наборы можно добавить в корзину и оформить заявку на сайте. Индивидуальный
            набор собирается в{" "}
            <Link href="/custom">форме заявки</Link>: повод, размер, шоколад, дата и оформление.
            После отправки кондитер связывается с вами, подтверждает состав и стоимость.
          </p>

          <h2>Контакты</h2>
          <p>
            {site.addressFull}. {site.hours}. Телефон{" "}
            <a href={site.phoneHref}>{site.phone}</a>, WhatsApp, Instagram{" "}
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">
              {site.instagramHandle}
            </a>
            . Карточка компании в{" "}
            <a href={site.mapUrl} target="_blank" rel="noopener noreferrer">
              2ГИС
            </a>
            .
          </p>

          <p style={{ fontSize: 12, color: "var(--muted)" }}>
            Наличие ягод, итоговый состав и стоимость доставки подтверждает кондитер при
            согласовании заказа. Цены в каталоге — ориентир по актуальному прайсу компании.
          </p>
        </div>
      </div>
    </div>
  );
}

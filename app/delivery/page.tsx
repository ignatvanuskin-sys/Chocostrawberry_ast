import Link from "next/link";
import type { Metadata } from "next";
import { site } from "../lib/site";
import { IconClock, IconPhone, IconPin, IconWhatsapp } from "../components/icons";

export const metadata: Metadata = {
  title: "Доставка и самовывоз",
  description:
    "Доставка наборов клубники и фиников в шоколаде по Астане и самовывоз с проспекта Мангилик Ел, 51/3. Ежедневно, круглосуточно.",
  alternates: { canonical: "/delivery" },
};

const faq = [
  {
    q: "Сколько стоит доставка?",
    a: "Стоимость зависит от адреса и времени. Мы не публикуем фиксированный тариф, потому что он не подтверждён компанией — кондитер назовёт сумму при оформлении заказа.",
  },
  {
    q: "Можно ли забрать самому?",
    a: `Да, самовывоз с ${site.address}, ${site.district}. Работаем ежедневно, круглосуточно. Перед выездом лучше написать в WhatsApp, чтобы заказ был готов.`,
  },
  {
    q: "Как быстро можно оформить заказ?",
    a: "Срок зависит от изделия и загрузки кондитера. В отзывах гости отмечают, что компания берёт и срочные заказы, но конкретное время подтверждается в переписке.",
  },
  {
    q: "Как перевозить набор?",
    a: "Наборы отдаём в коробках. В машине держите коробку на ровной поверхности, не оставляйте её в тёплом месте и старайтесь забрать заказ в день вручения.",
  },
  {
    q: "Можно ли оплатить онлайн?",
    a: "Оплата на сайте не проводится. Способ оплаты согласуется с кондитером после подтверждения заказа.",
  },
];

export default function DeliveryPage() {
  return (
    <div className="page container">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span aria-hidden>/</span>
        <span>Доставка и самовывоз</span>
      </nav>

      <header className="page-head">
        <div>
          <span className="eyebrow">Получение заказа</span>
          <h1 style={{ marginTop: 10 }}>
            Доставка
            <br />
            и самовывоз
          </h1>
        </div>
        <p className="page-head__aside">
          Доставляем по Астане. Забрать заказ можно ежедневно в любое время по адресу{" "}
          {site.address}.
        </p>
      </header>

      <div className="delivery" style={{ marginBottom: 40 }}>
        <div className="delivery__col">
          <div className="eyebrow">Доставка по городу</div>
          <h2 style={{ fontSize: "var(--fs-h3)" }}>Курьером до двери</h2>
          <p className="lead" style={{ fontSize: 14 }}>
            Стоимость и время доставки зависят от адреса и загрузки. Мы не указываем фиксированный
            тариф, пока он не подтверждён компанией — сумму назовёт кондитер при оформлении.
          </p>
          <div>
            <div className="delivery__row">
              <span>Зона</span>
              <span>Астана</span>
            </div>
            <div className="delivery__row">
              <span>Стоимость</span>
              <span>уточняется при заказе</span>
            </div>
            <div className="delivery__row">
              <span>Время</span>
              <span>по согласованию</span>
            </div>
            <div className="delivery__row">
              <span>Часы приёма</span>
              <span>{site.hoursShort}</span>
            </div>
          </div>
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
            style={{ alignSelf: "flex-start" }}
          >
            <IconWhatsapp size={16} /> Рассчитать доставку
          </a>
        </div>

        <div className="delivery__col">
          <div className="eyebrow">Самовывоз</div>
          <h2 style={{ fontSize: "var(--fs-h3)" }}>{site.address}</h2>
          <p className="lead" style={{ fontSize: 14 }}>
            {site.district}, {site.city}. Адрес и время готовности подтверждаем в переписке.
          </p>
          <div>
            <div className="delivery__row">
              <span>Адрес</span>
              <span>{site.address}</span>
            </div>
            <div className="delivery__row">
              <span>Режим</span>
              <span>{site.hours}</span>
            </div>
            <div className="delivery__row">
              <span>Телефон</span>
              <span>{site.phone}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={site.routeUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
              <IconPin size={16} /> Маршрут
            </a>
            <a href={site.phoneHref} className="btn btn--ghost">
              <IconPhone size={16} /> Позвонить
            </a>
          </div>
        </div>
      </div>

      <div className="two-col">
        <aside className="two-col__aside">
          <span>Частые вопросы</span>
          <span>
            <IconClock size={13} /> {site.hours}
          </span>
        </aside>
        <div>
          {faq.map((item) => (
            <details
              key={item.q}
              style={{
                borderTop: "1px solid var(--line)",
                padding: "16px 0",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: ".04em",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                {item.q}
                <span aria-hidden style={{ color: "var(--wine)" }}>
                  +
                </span>
              </summary>
              <p style={{ marginTop: 10, fontSize: 13, lineHeight: 1.65, color: "var(--ink-soft)" }}>
                {item.a}
              </p>
            </details>
          ))}
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 18 }}>
            <Link href="/contacts" className="link-arrow">
              Все контакты
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

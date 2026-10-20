import Link from "next/link";
import type { Metadata } from "next";
import { site } from "../lib/site";
import { IconInstagram, IconPhone, IconPin, IconWhatsapp } from "../components/icons";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Chocostrawberry: Астана, проспект Мангилик Ел, 51/3. Телефон +7 747 905 49 62, WhatsApp, Instagram. Ежедневно, круглосуточно.",
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
    <div className="page container">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span aria-hidden>/</span>
        <span>Контакты</span>
      </nav>

      <header className="page-head">
        <div>
          <span className="eyebrow">Связаться</span>
          <h1 style={{ marginTop: 10 }}>Контакты</h1>
        </div>
        <p className="page-head__aside">
          Отвечаем в WhatsApp и по телефону ежедневно, круглосуточно.
        </p>
      </header>

      <div className="two-col">
        <aside className="two-col__aside">
          <span>
            <IconPin size={13} /> Адрес
          </span>
          <span>
            <IconPhone size={13} /> Телефон
          </span>
          <span>
            <IconWhatsapp size={13} /> WhatsApp
          </span>
          <span>
            <IconInstagram size={13} /> Instagram
          </span>
        </aside>

        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              background: "var(--line)",
              border: "1px solid var(--line)",
            }}
          >
            <div style={{ background: "#fff", padding: "clamp(20px,3vw,34px)" }}>
              <div className="eyebrow">Адрес</div>
              <p style={{ fontSize: 20, textTransform: "uppercase", marginTop: 10, lineHeight: 1.2 }}>
                {site.city}
                <br />
                {site.address}
              </p>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 8 }}>{site.district}</p>
              <a
                href={site.routeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost btn--sm"
                style={{ marginTop: 16 }}
              >
                Построить маршрут
              </a>
            </div>

            <div style={{ background: "var(--bone)", padding: "clamp(20px,3vw,34px)" }}>
              <div className="eyebrow">Режим работы</div>
              <p style={{ fontSize: 20, textTransform: "uppercase", marginTop: 10, lineHeight: 1.2 }}>
                Ежедневно
                <br />
                круглосуточно
              </p>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 8 }}>
                Самовывоз и приём заказов
              </p>
            </div>

            <div style={{ background: "var(--bone)", padding: "clamp(20px,3vw,34px)" }}>
              <div className="eyebrow">Телефон</div>
              <a
                href={site.phoneHref}
                style={{ fontSize: 20, textTransform: "uppercase", marginTop: 10, display: "block" }}
              >
                {site.phone}
              </a>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 8 }}>
                Звонки и WhatsApp
              </p>
            </div>

            <div style={{ background: "#fff", padding: "clamp(20px,3vw,34px)" }}>
              <div className="eyebrow">Соцсети</div>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 20, textTransform: "uppercase", marginTop: 10, display: "block" }}
              >
                {site.instagramHandle}
              </a>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 8 }}>
                Новинки и работы — в Instagram
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
            >
              <IconWhatsapp size={16} /> Написать в WhatsApp
            </a>
            <a href={site.phoneHref} className="btn btn--ghost">
              <IconPhone size={16} /> Позвонить
            </a>
            <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
              Карточка в 2ГИС
            </a>
          </div>

          <p className="meta" style={{ marginTop: 22, maxWidth: "52ch", lineHeight: 1.7 }}>
            Рейтинг в 2ГИС — {site.rating.value} на основе {site.rating.ratings} оценок. Отзывы
            публикуются на карточке компании в 2ГИС.
          </p>
        </div>
      </div>
    </div>
  );
}

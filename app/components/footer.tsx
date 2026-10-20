import Link from "next/link";
import { site } from "../lib/site";
import { IconArrowUpRight, IconInstagram, IconPhone, IconWhatsapp } from "./icons";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col footer__brand">
            <div className="eyebrow">Клубника в шоколаде · Астана</div>
            <p className="footer__note" style={{ fontSize: 14, color: "var(--ink)" }}>
              Наборы, сердца и букеты из свежей клубники, финики в бельгийском шоколаде. Собираем
              вручную и доставляем по городу.
            </p>
            <div className="footer__social">
              <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <IconWhatsapp size={18} />
              </a>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <IconInstagram size={18} />
              </a>
              <a href={site.phoneHref} aria-label="Позвонить">
                <IconPhone size={17} />
              </a>
            </div>
          </div>

          <div className="footer__col">
            <div className="footer__h">Каталог</div>
            <Link className="footer__link" href="/catalog/sets">Наборы клубники</Link>
            <Link className="footer__link" href="/catalog/hearts">Сердца</Link>
            <Link className="footer__link" href="/catalog/bouquets">Букеты</Link>
            <Link className="footer__link" href="/catalog/dates">Финики в шоколаде</Link>
            <Link className="footer__link" href="/catalog/boxes">Подарочные боксы</Link>
          </div>

          <div className="footer__col">
            <div className="footer__h">Покупателям</div>
            <Link className="footer__link" href="/custom">Набор на заказ</Link>
            <Link className="footer__link" href="/delivery">Доставка и самовывоз</Link>
            <Link className="footer__link" href="/cart">Корзина</Link>
            <Link className="footer__link" href="/favorites">Избранное</Link>
            <Link className="footer__link" href="/about">О нас</Link>
            <Link className="footer__link" href="/contacts">Контакты</Link>
            <Link className="footer__link" href="/admin">Управление каталогом</Link>
          </div>

          <div className="footer__col">
            <div className="footer__h">Контакты</div>
            <a className="footer__link" href={site.phoneHref}>{site.phone}</a>
            <a className="footer__link" href={site.whatsappUrl} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a className="footer__link" href={site.instagram} target="_blank" rel="noopener noreferrer">
              {site.instagramHandle}
            </a>
            <span className="footer__link" style={{ color: "var(--ink-soft)", lineHeight: 1.7 }}>
              {site.address}
              <br />
              {site.district}
            </span>
            <span className="footer__link" style={{ color: "var(--ink-soft)" }}>{site.hours}</span>
            <a
              className="footer__link"
              href={site.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--wine)" }}
            >
              2ГИС <IconArrowUpRight size={12} />
            </a>
          </div>
        </div>

        <div className="footer__wordmark">
          <strong>{site.wordmark}</strong>
          <span>{site.wordmarkSub}</span>
        </div>

        {site.demo.catalog && (
          <p className="demo-note" id="demo-notice">
            <strong>Демонстрационная версия.</strong> Цены, веса и характеристики товаров в этом
            каталоге — тестовые. Перед запуском замените данные в{" "}
            <code>data/products.json</code> на подтверждённые компанией, а также условия доставки и
            оплаты.
          </p>
        )}

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>
            {site.city} · {site.hours}
          </span>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}

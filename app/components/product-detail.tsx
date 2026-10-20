"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "../lib/types";
import { formatPrice } from "../lib/format";
import { site } from "../lib/site";
import { useStore } from "./store";
import { track } from "../lib/analytics";
import { ProductCard } from "./product-card";
import {
  IconArrowRight,
  IconHeart,
  IconMinus,
  IconPlus,
  IconWhatsapp,
} from "./icons";

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60 * 1000).toISOString().slice(0, 10);
}

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { addLine, setPanel, favorites, toggleFavorite } = useStore();
  const [optionId, setOptionId] = useState(product.options[0].id);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [active, setActive] = useState(0);
  const [openAcc, setOpenAcc] = useState<string | null>("delivery");

  const option = product.options.find((o) => o.id === optionId) ?? product.options[0];
  const onRequest = option.price <= 0;
  const isFav = favorites.includes(product.slug);

  useEffect(() => {
    track("view_item", {
      item_id: product.slug,
      item_name: product.name,
      item_category: product.kind,
      price: option.price,
      currency: "KZT",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug]);

  useEffect(() => {
    setActive(0);
    setOptionId(product.options[0].id);
    setQty(1);
    setMessage("");
  }, [product.slug, product.options]);

  const accents = useMemo(() => {
    return [
      "Состав и аллергены",
      "Доставка и самовывоз",
      "Оплата и подтверждение",
    ];
  }, []);

  function add() {
    addLine(product.slug, option.id, qty, message.trim() || undefined, date || undefined);
    setPanel("cart");
  }

  return (
    <>
      <div className="pdp">
        <div className="pdp__gallery">
          <div className="pdp__stage">
            <Image
              key={product.images[active].src}
              src={product.images[active].src}
              alt={product.images[active].alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          </div>
          {product.images.length > 1 && (
            <div className="pdp__thumbs" role="tablist" aria-label="Фотографии товара">
              {product.images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-current={i === active}
                  className="pdp__thumb"
                  onClick={() => setActive(i)}
                  aria-label={`Фото ${i + 1}: ${img.alt}`}
                >
                  <Image src={img.src} alt="" width={112} height={112} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp__info">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <Link href="/">Главная</Link>
            <span aria-hidden>/</span>
            <Link href="/catalog">Каталог</Link>
            <span aria-hidden>/</span>
            <Link href={`/catalog/${product.categories[0]}`}>{product.kind}</Link>
          </nav>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
            <div>
              <div className="pdp__kind">{product.kind}</div>
              <h1 className="pdp__title" style={{ marginTop: 8 }}>
                {product.name}
              </h1>
            </div>
            <button
              type="button"
              className="icon-btn"
              onClick={() => toggleFavorite(product.slug)}
              aria-pressed={isFav}
              aria-label={isFav ? "Убрать из избранного" : "В избранное"}
              style={{
                width: 48,
                height: 48,
                flex: "none",
                background: isFav ? "var(--wine)" : "var(--stone)",
                color: isFav ? "#fff" : "var(--ink)",
              }}
            >
              <IconHeart size={18} filled={isFav} />
            </button>
          </div>

          <p className="pdp__sub">{product.subtitle}</p>

          <div className="pdp__price">
            <span className="pdp__price-value">{formatPrice(option.price)}</span>
            <span
              className="pdp__price-note"
              title="Итоговую стоимость и наличие подтверждает кондитер."
            >
              {site.demo.catalog ? "демо-цена" : "ориентир"}
            </span>
          </div>

          <div className="option-group">
            <div className="option-group__head">
              <span>Размер</span>
              <strong>{option.portions}</strong>
            </div>
            <div className="options" role="radiogroup" aria-label="Размер">
              {product.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={o.id === optionId}
                  className="option"
                  onClick={() => setOptionId(o.id)}
                >
                  {o.label}
                  <small>{o.portions}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="pdp-message">
              Пожелания к заказу
            </label>
            <textarea
              id="pdp-message"
              className="textarea"
              value={message}
              maxLength={140}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Надпись, цвет ленты, повод"
              rows={2}
            />
            <span className="field__hint">
              {message.length}/140 · Надпись и оформление согласуем в WhatsApp перед сборкой.
            </span>
          </div>

          <div className="field">
            <label className="label" htmlFor="pdp-date">
              Желаемая дата
            </label>
            <input
              id="pdp-date"
              type="date"
              className="input"
              min={todayISO()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <span className="field__hint">
              Слот не резервируется автоматически — дату и время подтверждает кондитер.
            </span>
          </div>

          <div className="pdp__buy">
            {onRequest ? (
              <div className="pdp__buy-row">
                <a
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary btn--lg"
                >
                  <IconWhatsapp size={16} /> Обсудить состав и стоимость
                </a>
              </div>
            ) : (
              <div className="pdp__buy-row">
                <div className="qty qty--lg">
                  <button
                    type="button"
                    onClick={() => setQty((v) => Math.max(1, v - 1))}
                    aria-label="Уменьшить количество"
                    disabled={qty <= 1}
                  >
                    <IconMinus size={14} />
                  </button>
                  <span aria-live="polite">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((v) => Math.min(99, v + 1))}
                    aria-label="Увеличить количество"
                  >
                    <IconPlus size={14} />
                  </button>
                </div>
                <button type="button" className="btn btn--primary btn--lg" onClick={add}>
                  Добавить в корзину · {formatPrice(option.price * qty)}
                </button>
              </div>
            )}
            <p className="pdp__hint">
              {onRequest
                ? "Этот бокс собирается индивидуально: расскажите о поводе, составе и дате — кондитер назовёт стоимость."
                : product.customizable
                  ? "Изделие готовится под заказ: после оформления кондитер свяжется с вами, чтобы согласовать декор, дату и время."
                  : "После оформления мы свяжемся с вами, чтобы подтвердить дату и способ получения."}{" "}
              <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer">
                Написать в WhatsApp
              </a>
            </p>
          </div>

          <div style={{ marginTop: 4 }}>
            {accents.map((title) => {
              const key = title;
              const isOpen = openAcc === key;
              return (
                <div className="acc" key={key}>
                  <button
                    type="button"
                    className="acc__btn"
                    aria-expanded={isOpen}
                    aria-controls={`acc-${key}`}
                    onClick={() => setOpenAcc(isOpen ? null : key)}
                  >
                    {title} <IconPlus size={13} />
                  </button>
                  <div className="acc__panel" data-open={isOpen} id={`acc-${key}`}>
                    <div>
                      <div className="acc__inner">
                        {key === "Состав и аллергены" && (
                          <>
                            <p>
                              Точный состав, вкус и аллергены подтверждает кондитер при согласовании
                              заказа. В изделиях могут использоваться молочные продукты, яйца,
                              глютен, орехи и ягоды.
                            </p>
                            <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer">
                              Уточнить состав
                            </a>
                          </>
                        )}
                        {key === "Доставка и самовывоз" && (
                          <>
                            <p>
                              Самовывоз: {site.addressFull}, {site.hours.toLowerCase()}.
                              Доставка по Астане — стоимость и время зависят от адреса, уточняются
                              при подтверждении заказа.
                            </p>
                            <Link href="/delivery">Подробнее о доставке</Link>
                          </>
                        )}
                        {key === "Оплата и подтверждение" && (
                          <>
                            <p>
                              Заявка с сайта не списывает деньги. После отправки кондитер
                              подтверждает наличие даты и стоимость, затем согласует способ оплаты.
                            </p>
                            <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer">
                              Задать вопрос
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pdp__sticky">
        <div className="pdp__sticky-price">
          {onRequest ? "по запросу" : formatPrice(option.price * qty)}
          <small>
            {option.label} · {option.portions}
          </small>
        </div>
        {onRequest ? (
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
          >
            WhatsApp
          </a>
        ) : (
          <button type="button" className="btn btn--primary" onClick={add}>
            В корзину
          </button>
        )}
      </div>

      {related.length > 0 && (
        <section className="section section--tight container">
          <div className="section-head">
            <div className="section-head__label">
              <span className="eyebrow">С этим часто заказывают</span>
              <h2 style={{ fontSize: "clamp(22px,2.6vw,34px)" }}>Похожие изделия</h2>
            </div>
            <Link href="/catalog" className="link-arrow">
              Весь каталог <IconArrowRight size={14} />
            </Link>
          </div>
          <div className="grid-products">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} sizes="20vw" />
            ))}
          </div>
        </section>
      )}

      <section className="section section--tight container">
        <div className="delivery">
          <div className="delivery__col">
            <div className="eyebrow">Вопрос по изделию</div>
            <h2 style={{ fontSize: "var(--fs-h3)" }}>Поможем выбрать</h2>
            <p className="lead" style={{ fontSize: 14 }}>
              Подскажем по весу, вкусу и декору. Ежедневно {site.hoursShort}.
            </p>
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
              style={{ alignSelf: "flex-start" }}
            >
              <IconWhatsapp size={16} /> WhatsApp
            </a>
          </div>
          <div className="delivery__col">
            <div className="eyebrow">Индивидуальный заказ</div>
            <h2 style={{ fontSize: "var(--fs-h3)" }}>Свой размер и оформление</h2>
            <p className="lead" style={{ fontSize: 14 }}>
              Если нужен другой размер, надпись или упаковка — оставьте заявку.
            </p>
            <Link href="/custom" className="btn btn--ghost" style={{ alignSelf: "flex-start" }}>
              Набор на заказ <IconArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

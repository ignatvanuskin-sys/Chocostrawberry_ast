"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "./store";
import { formatPrice } from "../lib/format";
import { IconArrowRight, IconMinus, IconPlus, IconTrash } from "./icons";
import { site } from "../lib/site";

export function CartView() {
  const { lines, catalog, setQty, removeLine, subtotal, hydrated } = useStore();

  if (!hydrated) {
    return <p className="meta">Загружаем корзину…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="empty">
        <span className="eyebrow">Корзина пуста</span>
        <h3>Пока здесь ничего нет</h3>
        <p>
          Начните с набора клубники: его проще всего подарить, и он не требует долгого согласования.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/catalog/sets" className="btn btn--primary">
            Смотреть наборы
          </Link>
          <Link href="/catalog" className="btn btn--ghost">
            Весь каталог <IconArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div>
        <div className="cart-table">
          {lines.map((line) => {
            const product = catalog[line.slug];
            const option = product?.options.find((o) => o.id === line.optionId);
            if (!product || !option) return null;
            return (
              <div className="cart-row" key={line.key}>
                <Image
                  src={product.image}
                  alt=""
                  width={264}
                  height={220}
                  className="cart-row__img"
                />
                <div>
                  <Link href={`/product/${product.slug}`} className="cart-row__name">
                    {product.name}
                  </Link>
                  <div className="cart-row__meta">
                    {option.label} · {option.portions} · {formatPrice(option.price)}
                  </div>
                  {line.message && <div className="cart-row__msg">«{line.message}»</div>}
                  {line.date && (
                    <div className="cart-row__msg">
                      Желаемая дата:{" "}
                      {new Date(`${line.date}T12:00:00`).toLocaleDateString("ru-RU")}
                    </div>
                  )}
                </div>
                <div className="qty">
                  <button
                    type="button"
                    onClick={() => setQty(line.key, line.qty - 1)}
                    aria-label="Уменьшить количество"
                  >
                    <IconMinus size={12} />
                  </button>
                  <span aria-live="polite">{line.qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(line.key, line.qty + 1)}
                    aria-label="Увеличить количество"
                  >
                    <IconPlus size={12} />
                  </button>
                </div>
                <div className="cart-row__price">{formatPrice(option.price * line.qty)}</div>
                <button
                  type="button"
                  className="cart-row__remove"
                  onClick={() => removeLine(line.key)}
                  aria-label={`Удалить ${product.name}`}
                >
                  <IconTrash size={15} />
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, gap: 12, flexWrap: "wrap" }}>
          <Link href="/catalog" className="link-arrow">
            Продолжить покупки
          </Link>
          <span className="meta">Цены — ориентир, итог подтверждает кондитер</span>
        </div>
      </div>

      <aside className="summary">
        <div className="summary__row">
          <span>Товаров</span>
          <span>{lines.reduce((s, l) => s + l.qty, 0)}</span>
        </div>
        <div className="summary__row">
          <span>Сумма</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="summary__row">
          <span>Доставка</span>
          <span>уточняется</span>
        </div>
        <div className="summary__row summary__row--total">
          <span>Итого</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <Link href="/checkout" className="btn btn--primary btn--block">
          Оформить заказ
        </Link>
        <p className="summary__note">
          Заявка не списывает деньги. Кондитер подтвердит наличие даты, стоимость доставки и способ
          оплаты. Вопросы —{" "}
          <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--wine)", borderBottom: "1px solid currentColor" }}>
            WhatsApp
          </a>
          .
        </p>
      </aside>
    </div>
  );
}

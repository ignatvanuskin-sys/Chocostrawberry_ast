"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "./store";
import { formatPrice } from "../lib/format";
import { site } from "../lib/site";
import { track } from "../lib/analytics";
import { IconArrowLeft, IconCheck, IconWhatsapp } from "./icons";

type Errors = Partial<Record<"name" | "phone" | "address" | "date" | "items", string>>;

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60 * 1000).toISOString().slice(0, 10);
}

function formatPhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (!digits.startsWith("7")) digits = "7" + digits;
  digits = digits.slice(0, 11);
  let out = "+7";
  if (digits.length > 1) out += ` (${digits.slice(1, 4)}`;
  if (digits.length >= 5) out += `) ${digits.slice(4, 7)}`;
  if (digits.length >= 8) out += `-${digits.slice(7, 9)}`;
  if (digits.length >= 10) out += `-${digits.slice(9, 11)}`;
  return out;
}

const TIMES = Array.from({ length: 29 }, (_, i) => {
  const minutes = 9 * 60 + i * 30;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});

export function CheckoutForm() {
  const { lines, catalog, subtotal, clear, hydrated } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState<{
    orderId: string;
    notified: boolean;
    total: number;
    whatsapp: string;
    summary: string;
  } | null>(null);

  const itemCount = lines.reduce((s, l) => s + l.qty, 0);

  useEffect(() => {
    if (!hydrated) return;
    track("begin_checkout", {
      value: subtotal,
      currency: "KZT",
      items: lines.map((l) => ({ item_id: l.slug, quantity: l.qty })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    if (!date && hydrated) setDate(tomorrowISO());
  }, [hydrated, date]);

  const summaryText = useMemo(() => {
    const items = lines
      .map((l) => {
        const p = catalog[l.slug];
        const o = p?.options.find((x) => x.id === l.optionId);
        return p && o ? `${p.name} (${o.label}) × ${l.qty} — ${formatPrice(o.price * l.qty)}` : "";
      })
      .filter(Boolean);
    return [
      `Заказ с сайта ${site.name}`,
      ...items,
      `Итого: ${formatPrice(subtotal)}`,
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      `Получение: ${method === "delivery" ? "доставка" : "самовывоз"}${method === "delivery" && address ? `, ${address}` : ""}`,
      date ? `Дата: ${date}` : "",
      time ? `Время: ${time}` : "",
      comment ? `Комментарий: ${comment}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [lines, catalog, subtotal, name, phone, method, address, date, time, comment]);

  function validate(): boolean {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Укажите имя — минимум 2 символа";
    if (phone.replace(/\D/g, "").length < 11) next.phone = "Введите номер в формате +7 (777) 000-00-00";
    if (method === "delivery" && address.trim().length < 5) next.address = "Укажите улицу, дом и квартиру";
    if (!date) next.date = "Выберите желаемую дату";
    if (lines.length === 0) next.items = "Корзина пуста";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: name.trim(),
            phone,
            method,
            address: method === "delivery" ? address.trim() : "",
            date,
            time,
            comment: comment.trim(),
          },
          items: lines.map((l) => ({
            slug: l.slug,
            optionId: l.optionId,
            qty: l.qty,
            message: l.message,
            date: l.date,
          })),
        }),
      });

      const data = (await res.json()) as {
        ok: boolean;
        orderId?: string;
        notified?: boolean;
        total?: number;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setFormError(data.error ?? "Не удалось отправить заявку. Попробуйте ещё раз или напишите в WhatsApp.");
        return;
      }

      const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
        `${summaryText}\n\nНомер заявки: ${data.orderId}`
      )}`;

      track("purchase", {
        transaction_id: data.orderId,
        value: subtotal,
        currency: "KZT",
        items: lines.map((l) => ({ item_id: l.slug, quantity: l.qty })),
      });

      setDone({
        orderId: data.orderId ?? "",
        notified: Boolean(data.notified),
        total: data.total ?? subtotal,
        whatsapp: wa,
        summary: summaryText,
      });
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError("Сеть недоступна. Проверьте подключение и попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="success">
        <div className="success__mark">
          <IconCheck size={28} />
        </div>
        <span className="eyebrow">Заявка принята</span>
        <h1>Спасибо, {name.split(" ")[0]}!</h1>
        <p className="success__id">Номер заявки: {done.orderId}</p>
        <p className="lead">
          Сумма к согласованию — <strong>{formatPrice(done.total)}</strong>. Это ещё не подтверждённый
          заказ: кондитер проверит дату и состав, затем свяжется с вами по номеру {phone}.
        </p>

        {!done.notified && (
          <div className="demo-note" style={{ maxWidth: "100%" }}>
            <strong>Важно.</strong> Уведомления в Telegram на этом стенде не настроены
            (нет <code>TELEGRAM_BOT_TOKEN</code> и <code>TELEGRAM_CHAT_ID</code>), поэтому заявка
            сохранена только на сервере. Чтобы кондитер получил её сразу, продублируйте заказ в
            WhatsApp — текст уже готов.
          </div>
        )}

        <div className="success__actions">
          <a
            href={done.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
          >
            <IconWhatsapp size={16} /> Отправить в WhatsApp
          </a>
          <Link href="/catalog" className="btn btn--ghost">
            Вернуться в каталог
          </Link>
        </div>

        <div className="summary" style={{ position: "static", width: "100%", marginTop: 12 }}>
          <div className="summary__note" style={{ whiteSpace: "pre-line", fontSize: 12 }}>
            {done.summary}
          </div>
        </div>
      </div>
    );
  }

  if (!hydrated) {
    return <p className="meta">Загружаем оформление…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="empty">
        <span className="eyebrow">Корзина пуста</span>
        <h3>Оформлять пока нечего</h3>
        <p>Добавьте набор — и вернитесь к оформлению.</p>
        <Link href="/catalog" className="btn btn--primary">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout">
      <form className="checkout__form" onSubmit={submit} noValidate>
        <div className="form-block">
          <div className="form-block__title">
            <span>01</span> Контакты
          </div>
          <div className="field-row">
            <div className="field">
              <label className="label" htmlFor="name">
                Имя <span>*</span>
              </label>
              <input
                id="name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                autoComplete="name"
                placeholder="Как к вам обращаться"
              />
              {errors.name && (
                <span className="field__error" id="name-error">
                  {errors.name}
                </span>
              )}
            </div>
            <div className="field">
              <label className="label" htmlFor="phone">
                Телефон <span>*</span>
              </label>
              <input
                id="phone"
                className="input"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 (777) 000-00-00"
              />
              {errors.phone && (
                <span className="field__error" id="phone-error">
                  {errors.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="form-block">
          <div className="form-block__title">
            <span>02</span> Как получить
          </div>
          <div className="choice-row">
            <label className="choice">
              <input
                type="radio"
                name="method"
                value="delivery"
                checked={method === "delivery"}
                onChange={() => setMethod("delivery")}
              />
              <span className="choice__name">Доставка</span>
              <span className="choice__desc">По Астане, стоимость уточняется</span>
            </label>
            <label className="choice">
              <input
                type="radio"
                name="method"
                value="pickup"
                checked={method === "pickup"}
                onChange={() => setMethod("pickup")}
              />
              <span className="choice__name">Самовывоз</span>
              <span className="choice__desc">{site.address}, {site.hoursShort}</span>
            </label>
          </div>

          {method === "delivery" && (
            <div className="field">
              <label className="label" htmlFor="address">
                Адрес доставки <span>*</span>
              </label>
              <input
                id="address"
                className="input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                aria-invalid={Boolean(errors.address)}
                aria-describedby={errors.address ? "address-error" : undefined}
                autoComplete="street-address"
                placeholder="Улица, дом, квартира, подъезд"
              />
              {errors.address && (
                <span className="field__error" id="address-error">
                  {errors.address}
                </span>
              )}
              <span className="field__hint">
                Стоимость и время доставки кондитер подтвердит после оформления.
              </span>
            </div>
          )}
        </div>

        <div className="form-block">
          <div className="form-block__title">
            <span>03</span> Дата и время
          </div>
          <div className="field-row">
            <div className="field">
              <label className="label" htmlFor="date">
                Желаемая дата <span>*</span>
              </label>
              <input
                id="date"
                type="date"
                className="input"
                min={tomorrowISO()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-invalid={Boolean(errors.date)}
              />
              {errors.date && <span className="field__error">{errors.date}</span>}
            </div>
            <div className="field">
              <label className="label" htmlFor="time">
                Желаемое время
              </label>
              <select
                id="time"
                className="input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="">Не важно / согласуем</option>
                {TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <span className="field__hint">
            Слот не бронируется автоматически: дату и время подтверждает кондитер.
          </span>
        </div>

        <div className="form-block">
          <div className="form-block__title">
            <span>04</span> Комментарий
          </div>
          <div className="field">
            <label className="label" htmlFor="comment">
              Пожелания к заказу
            </label>
            <textarea
              id="comment"
              className="textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={600}
              placeholder="Надпись, цвет ленты, повод, особенности"
            />
          </div>
        </div>

        {formError && <div className="form-error">{formError}</div>}

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button type="submit" className="btn btn--primary btn--lg" disabled={submitting} aria-busy={submitting}>
            {submitting ? "Отправляем…" : "Отправить заявку"}
          </button>
          <Link href="/cart" className="link-arrow">
            <IconArrowLeft size={13} /> В корзину
          </Link>
        </div>

        <p className="field__hint" style={{ maxWidth: "62ch" }}>
          Нажимая «Отправить заявку», вы соглашаетесь на обработку контактных данных для связи по
          заказу. Оплата на сайте не проводится.
        </p>
      </form>

      <aside className="summary">
        <div className="summary__row" style={{ fontSize: 10, letterSpacing: ".14em" }}>
          <span>Ваш заказ</span>
          <span>{itemCount} шт.</span>
        </div>
        <div className="checkout__items">
          {lines.map((l) => {
            const p = catalog[l.slug];
            const o = p?.options.find((x) => x.id === l.optionId);
            if (!p || !o) return null;
            return (
              <div className="checkout__item" key={l.key}>
                <Image src={p.image} alt="" width={96} height={96} />
                <div>
                  <div className="checkout__item-name">{p.name}</div>
                  <div className="checkout__item-meta">
                    {o.label} · {l.qty} шт.
                    {l.date ? ` · ${new Date(`${l.date}T12:00:00`).toLocaleDateString("ru-RU")}` : ""}
                  </div>
                </div>
                <div className="checkout__item-price">{formatPrice(o.price * l.qty)}</div>
              </div>
            );
          })}
        </div>
        <div className="summary__row">
          <span>Товары</span>
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
        <p className="summary__note">
          Сумма демонстрационная. Кондитер подтвердит итоговую стоимость и условия получения.
        </p>
      </aside>
    </div>
  );
}

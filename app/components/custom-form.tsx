"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { site } from "../lib/site";
import { track } from "../lib/analytics";
import { formatPrice } from "../lib/format";
import { IconCheck, IconWhatsapp } from "./icons";

const OCCASIONS = [
  "День рождения",
  "Свадьба",
  "14 февраля",
  "8 марта",
  "Годовщина",
  "Корпоратив",
  "Другое",
];
const WEIGHTS = [
  "Мини · до 10 ягод",
  "Средний · 10–25 ягод",
  "Большой · 25–50 ягод",
  "Очень большой · 50+",
  "Не знаю",
];
const FLAVORS = [
  "Молочный шоколад",
  "Тёмный шоколад",
  "Белый шоколад",
  "Микс",
  "С фисташкой",
  "Дубайский",
  "Без орехов",
];
const BUDGETS = ["до 10 000 ₸", "10 000–25 000 ₸", "25 000–50 000 ₸", "от 50 000 ₸", "Не определён"];

type Errors = Partial<Record<"name" | "phone" | "occasion" | "weight" | "date", string>>;

export function CustomForm() {
  const [occasion, setOccasion] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");
  const [flavors, setFlavors] = useState<string[]>([]);
  const [design, setDesign] = useState("");
  const [inscription, setInscription] = useState("");
  const [company, setCompany] = useState("");
  const [link, setLink] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState<{ id: string; notified: boolean; whatsapp: string } | null>(null);

  const isCorporate = occasion === "Корпоратив";

  const filled = [occasion, weight, date, name, phone].filter(Boolean).length;
  const progress = Math.round((filled / 5) * 100);

  const summaryText = useMemo(
    () =>
      [
        `Заявка на индивидуальный набор — ${site.name}`,
        `Повод: ${occasion || "—"}`,
        `Размер: ${weight || "—"}`,
        `Дата: ${date || "—"}`,
        flavors.length ? `Шоколад и начинка: ${flavors.join(", ")}` : "",
        isCorporate && company ? `Компания: ${company}` : "",
        inscription ? `Надпись: ${inscription}` : "",
        design ? `Дизайн: ${design}` : "",
        link ? `Пример: ${link}` : "",
        budget ? `Бюджет: ${budget}` : "",
        `Имя: ${name}`,
        `Телефон: ${phone}`,
      ]
        .filter(Boolean)
        .join("\n"),
    [occasion, weight, date, flavors, isCorporate, company, inscription, design, link, budget, name, phone]
  );

  function toggleFlavor(value: string) {
    setFlavors((prev) => (prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]));
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const next: Errors = {};
    if (!occasion) next.occasion = "Выберите повод";
    if (!weight) next.weight = "Выберите размер набора";
    if (!date) next.date = "Выберите дату";
    if (name.trim().length < 2) next.name = "Укажите имя";
    if (phone.replace(/\D/g, "").length < 11) next.phone = "Укажите номер телефона";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          occasion,
          weight,
          date,
          flavors,
          design,
          inscription,
          company,
          link,
          budget,
        }),
      });
      const data = (await res.json()) as { ok: boolean; id?: string; notified?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setFormError(data.error ?? "Не удалось отправить заявку. Напишите нам в WhatsApp.");
        return;
      }
      track("generate_lead", { occasion, weight, budget });
      setDone({
        id: data.id ?? "",
        notified: Boolean(data.notified),
        whatsapp: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
          `${summaryText}\n\nНомер заявки: ${data.id}`
        )}`,
      });
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
        <span className="eyebrow">Заявка отправлена</span>
        <h1>Обсудим детали</h1>
        <p className="success__id">Номер заявки: {done.id}</p>
        <p className="lead">
          Стоимость индивидуального набора рассчитывается после согласования: размер, декор и сроки
          влияют на цену. Кондитер свяжется с вами по номеру {phone}.
        </p>
        {!done.notified && (
          <div className="demo-note" style={{ maxWidth: "100%" }}>
            <strong>Важно.</strong> Telegram-уведомления на этом стенде не настроены, заявка
            сохранена только на сервере. Чтобы получить ответ быстрее — продублируйте её в WhatsApp.
          </div>
        )}
        <div className="success__actions">
          <a href={done.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
            <IconWhatsapp size={16} /> Отправить в WhatsApp
          </a>
          <Link href="/catalog" className="btn btn--ghost">
            Посмотреть каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="wizard" onSubmit={submit} noValidate>
      <div className="wizard__steps">
        <div>
          <div className="wizard__progress" aria-hidden>
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="field__hint" style={{ marginTop: 8 }}>
            Заполнено {filled} из 5 обязательных пунктов
          </p>
        </div>

        <section className="wstep">
          <div className="wstep__head">
            <span className="wstep__num">01</span>
            <h2 className="wstep__title">Повод</h2>
            {errors.occasion && <span className="wstep__hint" style={{ color: "var(--error)" }}>{errors.occasion}</span>}
          </div>
          <div className="chips">
            {OCCASIONS.map((o) => (
              <button
                key={o}
                type="button"
                className="chip"
                aria-pressed={occasion === o}
                onClick={() => setOccasion(o)}
              >
                {o}
              </button>
            ))}
          </div>
        </section>

        <section className="wstep">
          <div className="wstep__head">
            <span className="wstep__num">02</span>
            <h2 className="wstep__title">Размер набора</h2>
          </div>
          <div className="chips">
            {WEIGHTS.map((w) => (
              <button
                key={w}
                type="button"
                className="chip"
                aria-pressed={weight === w}
                onClick={() => setWeight(w)}
              >
                {w}
              </button>
            ))}
          </div>
        </section>

        <section className="wstep">
          <div className="wstep__head">
            <span className="wstep__num">03</span>
            <h2 className="wstep__title">Дата</h2>
            {errors.date && <span className="wstep__hint" style={{ color: "var(--error)" }}>{errors.date}</span>}
          </div>
          <div className="field" style={{ maxWidth: 280 }}>
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              aria-label="Дата"
            />
          </div>
          <p className="field__hint" style={{ marginTop: 8 }}>
            Дата считается согласованной только после подтверждения кондитером.
          </p>
        </section>

        <section className="wstep">
          <div className="wstep__head">
            <span className="wstep__num">04</span>
            <h2 className="wstep__title">Шоколад и начинка</h2>
            <span className="wstep__hint">можно несколько</span>
          </div>
          <div className="chips">
            {FLAVORS.map((f) => (
              <button
                key={f}
                type="button"
                className="chip"
                aria-pressed={flavors.includes(f)}
                onClick={() => toggleFlavor(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        <section className="wstep">
          <div className="wstep__head">
            <span className="wstep__num">05</span>
            <h2 className="wstep__title">Дизайн и надпись</h2>
          </div>

          {isCorporate && (
            <div className="field" style={{ marginBottom: 12 }}>
              <label className="label" htmlFor="company">
                Компания
              </label>
              <input
                id="company"
                className="input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Название и повод"
              />
            </div>
          )}

          <div className="field">
            <label className="label" htmlFor="design">
              Пожелания по дизайну
            </label>
            <textarea
              id="design"
              className="textarea"
              value={design}
              onChange={(e) => setDesign(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Цвет ленты, упаковка, декор, открытка"
            />
          </div>

          <div className="field-row" style={{ marginTop: 12 }}>
            <div className="field">
              <label className="label" htmlFor="inscription">
                Текст для надписи
              </label>
              <input
                id="inscription"
                className="input"
                value={inscription}
                onChange={(e) => setInscription(e.target.value)}
                maxLength={60}
                placeholder="Например, «С днём рождения, Алия»"
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="link">
                Ссылка на пример
              </label>
              <input
                id="link"
                className="input"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Instagram или Pinterest"
                inputMode="url"
              />
            </div>
          </div>
          <p className="field__hint" style={{ marginTop: 8 }}>
            Фотографию-пример можно прислать в WhatsApp — загрузка файлов на сайте не настроена.
          </p>
        </section>

        <section className="wstep">
          <div className="wstep__head">
            <span className="wstep__num">06</span>
            <h2 className="wstep__title">Бюджет</h2>
            <span className="wstep__hint">ориентир</span>
          </div>
          <div className="chips">
            {BUDGETS.map((b) => (
              <button
                key={b}
                type="button"
                className="chip"
                aria-pressed={budget === b}
                onClick={() => setBudget(b)}
              >
                {b}
              </button>
            ))}
          </div>
        </section>

        <section className="wstep">
          <div className="wstep__head">
            <span className="wstep__num">07</span>
            <h2 className="wstep__title">Контакты</h2>
          </div>
          <div className="field-row">
            <div className="field">
              <label className="label" htmlFor="c-name">
                Имя <span>*</span>
              </label>
              <input
                id="c-name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={Boolean(errors.name)}
                autoComplete="name"
                placeholder="Как к вам обращаться"
              />
              {errors.name && <span className="field__error">{errors.name}</span>}
            </div>
            <div className="field">
              <label className="label" htmlFor="c-phone">
                Телефон <span>*</span>
              </label>
              <input
                id="c-phone"
                className="input"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                aria-invalid={Boolean(errors.phone)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 (777) 000-00-00"
              />
              {errors.phone && <span className="field__error">{errors.phone}</span>}
            </div>
          </div>
        </section>

        {formError && <div className="form-error">{formError}</div>}

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button type="submit" className="btn btn--primary btn--lg" disabled={submitting} aria-busy={submitting}>
            {submitting ? "Отправляем…" : "Отправить заявку"}
          </button>
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-arrow"
          >
            <IconWhatsapp size={13} /> Или написать в WhatsApp
          </a>
        </div>
        <p className="field__hint" style={{ maxWidth: "62ch" }}>
          Заявка не является заказом. Стоимость и сроки кондитер подтверждает после обсуждения
          деталей. Оплата на сайте не проводится.
        </p>
      </div>

      <aside className="summary">
        <div className="summary__row" style={{ fontSize: 10, letterSpacing: ".14em" }}>
          <span>Ваша заявка</span>
          <span>{progress}%</span>
        </div>
        <div className="summary__row">
          <span>Повод</span>
          <span>{occasion || "—"}</span>
        </div>
        <div className="summary__row">
          <span>Размер</span>
          <span>{weight || "—"}</span>
        </div>
        <div className="summary__row">
          <span>Дата</span>
          <span>{date ? new Date(`${date}T12:00:00`).toLocaleDateString("ru-RU") : "—"}</span>
        </div>
        <div className="summary__row">
          <span>Шоколад</span>
          <span style={{ maxWidth: "60%", textAlign: "right" }}>
            {flavors.length ? flavors.join(", ") : "—"}
          </span>
        </div>
        <div className="summary__row">
          <span>Бюджет</span>
          <span>{budget || "—"}</span>
        </div>
        <div className="summary__row summary__row--total">
          <span>Стоимость</span>
          <strong style={{ fontSize: 14 }}>после согласования</strong>
        </div>
        <p className="summary__note">
          Мы не рассчитываем цену автоматически: она зависит от размера, декора и срока. Ориентир
          по готовым наборам — в каталоге, стоимость индивидуального набора назовёт кондитер.
        </p>
        <a
          href={site.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--ghost btn--block btn--sm"
        >
          <IconWhatsapp size={15} /> Задать вопрос
        </a>
      </aside>
    </form>
  );
}

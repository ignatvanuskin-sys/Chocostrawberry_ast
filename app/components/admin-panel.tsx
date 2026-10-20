"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "../lib/types";
import type { StoredOrder } from "../lib/server-store";
import { formatPrice } from "../lib/format";

type Tab = "catalog" | "orders";

const STATUSES: Array<{ id: StoredOrder["status"]; label: string }> = [
  { id: "new", label: "Новая" },
  { id: "confirmed", label: "Подтверждена" },
  { id: "in_progress", label: "В работе" },
  { id: "done", label: "Выполнена" },
  { id: "cancelled", label: "Отменена" },
];

export function AdminPanel() {
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("catalog");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { name: string; price: string; subtitle: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("chocostrawberry:admin-token");
    if (saved) setToken(saved);
  }, []);

  const loadProducts = useCallback(async () => {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = await res.json();
    setProducts(data.products as Product[]);
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  async function connect() {
    setError("");
    const res = await fetch("/api/orders", {
      headers: { "x-admin-token": token },
      cache: "no-store",
    });
    if (!res.ok) {
      setConnected(false);
      setError(
        res.status === 401
          ? "Токен не подошёл. Проверьте ADMIN_TOKEN в .env.local и перезапустите сервер."
          : "Не удалось подключиться."
      );
      return;
    }
    const data = await res.json();
    setOrders(data.orders as StoredOrder[]);
    setConnected(true);
    sessionStorage.setItem("chocostrawberry:admin-token", token);
  }

  async function refreshOrders() {
    const res = await fetch("/api/orders", {
      headers: { "x-admin-token": token },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders as StoredOrder[]);
    }
  }

  async function saveProduct(product: Product) {
    const draft = drafts[product.slug];
    if (!draft) return;
    setSaving(product.slug);
    setNotice("");
    const res = await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({
        slug: product.slug,
        patch: {
          name: draft.name,
          subtitle: draft.subtitle,
          firstOptionPrice: Number(draft.price),
        },
      }),
    });
    const data = await res.json();
    setSaving(null);
    if (!res.ok) {
      setNotice(data.error ?? "Не удалось сохранить");
      return;
    }
    setNotice(`Сохранено: ${draft.name}`);
    setDrafts((d) => {
      const next = { ...d };
      delete next[product.slug];
      return next;
    });
    void loadProducts();
  }

  async function setStatus(order: StoredOrder, status: StoredOrder["status"]) {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id: order.id, status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    }
  }

  function draftFor(p: Product) {
    return (
      drafts[p.slug] ?? {
        name: p.name,
        price: String(p.options[0]?.price ?? 0),
        subtitle: p.subtitle,
      }
    );
  }

  return (
    <div className="admin">
      <div className="admin__bar">
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span className="eyebrow">Доступ</span>
          <input
            className="input"
            style={{ height: 44, width: 240 }}
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ADMIN_TOKEN"
            aria-label="Токен администратора"
          />
          <button type="button" className="btn btn--primary btn--sm" onClick={connect}>
            {connected ? "Обновить" : "Подключиться"}
          </button>
          {connected && <span className="status status--done">Подключено</span>}
        </div>
        <div className="admin__tabs">
          <button
            type="button"
            className="admin__tab"
            aria-selected={tab === "catalog"}
            onClick={() => setTab("catalog")}
          >
            Каталог
          </button>
          <button
            type="button"
            className="admin__tab"
            aria-selected={tab === "orders"}
            onClick={() => {
              setTab("orders");
              void refreshOrders();
            }}
          >
            Заявки
          </button>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}
      {notice && <p className="field__hint">{notice}</p>}

      {!connected && (
        <div className="demo-note" style={{ maxWidth: "100%" }}>
          <strong>Как включить панель.</strong> Добавьте в <code>.env.local</code> строку{" "}
          <code>ADMIN_TOKEN=ваш-токен</code>, перезапустите сервер и введите этот токен выше.
          Без токена API отвечает 401 — это защита от случайного редактирования каталога.
        </div>
      )}

      {tab === "catalog" && (
        <div className="admin__table-wrap">
          <table>
            <thead>
              <tr>
                <th>Фото</th>
                <th>Название</th>
                <th>Подзаголовок</th>
                <th>Цена, ₸</th>
                <th>Категории</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const draft = draftFor(p);
                const dirty =
                  draft.name !== p.name ||
                  draft.subtitle !== p.subtitle ||
                  Number(draft.price) !== p.options[0]?.price;
                return (
                  <tr key={p.slug}>
                    <td>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="admin__thumb" src={p.images[0]?.src} alt="" />
                    </td>
                    <td style={{ minWidth: 220 }}>
                      <input
                        value={draft.name}
                        onChange={(e) =>
                          setDrafts((d) => ({ ...d, [p.slug]: { ...draft, name: e.target.value } }))
                        }
                        aria-label={`Название ${p.slug}`}
                      />
                      <div className="field__hint" style={{ marginTop: 4 }}>
                        /product/{p.slug}
                      </div>
                    </td>
                    <td style={{ minWidth: 240 }}>
                      <input
                        value={draft.subtitle}
                        onChange={(e) =>
                          setDrafts((d) => ({ ...d, [p.slug]: { ...draft, subtitle: e.target.value } }))
                        }
                        aria-label={`Подзаголовок ${p.slug}`}
                      />
                    </td>
                    <td style={{ width: 110 }}>
                      <input
                        type="number"
                        value={draft.price}
                        onChange={(e) =>
                          setDrafts((d) => ({ ...d, [p.slug]: { ...draft, price: e.target.value } }))
                        }
                        aria-label={`Цена ${p.slug}`}
                      />
                    </td>
                    <td className="field__hint" style={{ minWidth: 130 }}>
                      {p.categories.join(", ")}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn--quiet btn--sm"
                        disabled={!dirty || saving === p.slug || !connected}
                        onClick={() => saveProduct(p)}
                      >
                        {saving === p.slug ? "…" : "Сохранить"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "orders" && (
        <div className="admin__table-wrap">
          {orders.length === 0 ? (
            <p style={{ padding: 24, fontSize: 13, color: "var(--ink-soft)" }}>
              Заявок пока нет. Оформите тестовый заказ на сайте — он появится здесь.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>Дата</th>
                  <th>Клиент</th>
                  <th>Состав</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th>Telegram</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ whiteSpace: "nowrap" }}>{o.id}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {new Date(o.createdAt).toLocaleString("ru-RU")}
                    </td>
                    <td style={{ minWidth: 160 }}>
                      {String(o.customer.name ?? "")}
                      <div className="field__hint">{String(o.customer.phone ?? "")}</div>
                    </td>
                    <td style={{ minWidth: 240 }}>
                      {o.type === "custom" ? (
                        <span className="field__hint">
                          Индивидуальный: {String(o.custom?.occasion ?? "")},{" "}
                          {String(o.custom?.weight ?? "")}
                        </span>
                      ) : (
                        <ul style={{ margin: 0, paddingLeft: 14, fontSize: 11 }}>
                          {(o.items ?? []).map((i, idx) => (
                            <li key={idx}>
                              {String(i.name)} · {String(i.optionLabel)} × {String(i.qty)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {typeof o.total === "number" ? formatPrice(o.total) : "—"}
                    </td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => setStatus(o, e.target.value as StoredOrder["status"])}
                        aria-label={`Статус ${o.id}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="field__hint">{o.notified ? "отправлено" : "нет"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <p className="field__hint" style={{ maxWidth: "70ch" }}>
        Панель работает с файлом <code>data/products.json</code> и <code>data/orders.json</code>.
        На serverless-хостинге файловая система только для чтения — там нужен внешний storage
        (Postgres, Supabase, S3) или CMS. Подробности — в README.
      </p>
    </div>
  );
}

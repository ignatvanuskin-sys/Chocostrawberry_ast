"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category, Product } from "../lib/types";
import { formatPrice, priceFrom } from "../lib/format";
import { ProductCard } from "./product-card";
import {
  IconArrowRight,
  IconChevronDown,
  IconClose,
  IconDensity,
  IconFilter,
  IconGrid,
  IconPlus,
} from "./icons";
import { site } from "../lib/site";
import { track } from "../lib/analytics";

const SORTS = [
  { id: "popular", label: "Популярные" },
  { id: "new", label: "Новинки" },
  { id: "price-asc", label: "Цена: по возрастанию" },
  { id: "price-desc", label: "Цена: по убыванию" },
] as const;

function berryCount(product: Product): number {
  const portions = product.options.map((o) => o.portions).join(" ");
  if (/больш/i.test(portions)) return 100;
  const match = portions.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

const WEIGHTS = [
  { id: "s", label: "до 10 ягод", test: (p: Product) => berryCount(p) > 0 && berryCount(p) <= 10 },
  { id: "m", label: "11–25 ягод", test: (p: Product) => berryCount(p) >= 11 && berryCount(p) <= 25 },
  { id: "l", label: "от 30 ягод", test: (p: Product) => berryCount(p) >= 30 },
];

const PAGE = 10;

function toList(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

export function CatalogView({
  products,
  categories,
  lockedCategory,
}: {
  products: Product[];
  categories: Category[];
  lockedCategory?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [limit, setLimit] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceDraft, setPriceDraft] = useState<{ min: string; max: string }>({ min: "", max: "" });
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    cat: true,
    price: true,
    weight: true,
    occ: true,
  });

  const q = sp.get("q") ?? "";
  const cats = lockedCategory ? [lockedCategory] : toList(sp.get("cat"));
  const occ = toList(sp.get("occ"));
  const weights = toList(sp.get("weight"));
  const sort = (sp.get("sort") ?? "popular") as (typeof SORTS)[number]["id"];
  const view = sp.get("view") === "list" ? "list" : "grid";
  const dens = Number(sp.get("dens") ?? 5);

  const occasions = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.occasions))).sort(),
    [products]
  );

  const bounds = useMemo(() => {
    const prices = products.map(priceFrom);
    return { min: Math.min(...prices), max: Math.max(...products.map((p) => Math.max(...p.options.map((o) => o.price)))) };
  }, [products]);

  const minPrice = sp.get("min") !== null ? Number(sp.get("min")) : bounds.min;
  const maxPrice = sp.get("max") !== null ? Number(sp.get("max")) : bounds.max;

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const result = products.filter((p) => {
      if (cats.length && !cats.some((c) => p.categories.includes(c))) return false;
      if (occ.length && !occ.some((o) => p.occasions.includes(o))) return false;
      if (weights.length && !weights.some((w) => WEIGHTS.find((x) => x.id === w)?.test(p))) return false;
      const price = priceFrom(p);
      if (price < minPrice || price > maxPrice) return false;
      if (query) {
        const hay = `${p.name} ${p.kind} ${p.subtitle} ${p.style} ${p.occasions.join(" ")}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });

    const score = (p: Product) =>
      (p.badges.includes("hit") ? 3 : 0) + (p.badges.includes("new") ? 2 : 0);

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => priceFrom(a) - priceFrom(b));
        break;
      case "price-desc":
        result.sort((a, b) => priceFrom(b) - priceFrom(a));
        break;
      case "new":
        result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
      default:
        result.sort((a, b) => score(b) - score(a) || (a.createdAt < b.createdAt ? 1 : -1));
    }
    return result;
  }, [products, cats, occ, weights, minPrice, maxPrice, q, sort]);

  const searchString = sp.toString();
  useEffect(() => setLimit(PAGE), [searchString]);

  useEffect(() => {
    track("view_item_list", {
      item_list_name: lockedCategory ?? "catalog",
      items: filtered.slice(0, limit).map((p) => ({ item_id: p.slug, item_name: p.name })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, limit]);

  function push(next: URLSearchParams) {
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(sp.toString());
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
    next.delete("page");
    push(next);
  }

  function toggleMulti(key: string, value: string) {
    const current = toList(sp.get(key));
    const nextList = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    update(key, nextList.length ? nextList.join(",") : null);
  }

  function resetAll() {
    setPriceDraft({ min: "", max: "" });
    push(new URLSearchParams());
  }

  const activeCount =
    cats.length + occ.length + weights.length + (q ? 1 : 0) +
    (minPrice > bounds.min || maxPrice < bounds.max ? 1 : 0);

  const shown = filtered.slice(0, limit);

  const filtersBody = (
    <>
      <div className="filters__head">
        <span className="eyebrow" style={{ color: "var(--ink)" }}>
          Фильтры
        </span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            type="button"
            className="filters__reset"
            onClick={resetAll}
            disabled={activeCount === 0}
          >
            Сбросить
          </button>
          <button type="button" className="filters__done" onClick={() => setFiltersOpen(false)}>
            Готово
          </button>
        </div>
      </div>

      {!lockedCategory && (
        <div className="filter-group">
          <button
            type="button"
            className="filter-group__btn"
            aria-expanded={openGroups.cat}
            onClick={() => setOpenGroups((s) => ({ ...s, cat: !s.cat }))}
          >
            Категория <IconPlus size={12} />
          </button>
          {openGroups.cat && (
            <div className="filter-list">
              {categories.map((c) => {
                const count = products.filter((p) => p.categories.includes(c.slug)).length;
                return (
                  <label className="check" key={c.slug}>
                    <input
                      type="checkbox"
                      checked={cats.includes(c.slug)}
                      onChange={() => toggleMulti("cat", c.slug)}
                    />
                    {c.name}
                    <span className="check__count">{count}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="filter-group">
        <button
          type="button"
          className="filter-group__btn"
          aria-expanded={openGroups.price}
          onClick={() => setOpenGroups((s) => ({ ...s, price: !s.price }))}
        >
          Цена, ₸ <IconPlus size={12} />
        </button>
        {openGroups.price && (
          <>
            <div className="range">
              <input
                type="number"
                inputMode="numeric"
                aria-label="Минимальная цена"
                value={priceDraft.min !== "" ? priceDraft.min : String(minPrice)}
                min={bounds.min}
                max={bounds.max}
                onChange={(e) => setPriceDraft((d) => ({ ...d, min: e.target.value }))}
                onBlur={() => { update("min", priceDraft.min); setPriceDraft((d) => ({ ...d, min: "" })); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
              />
              <span>—</span>
              <input
                type="number"
                inputMode="numeric"
                aria-label="Максимальная цена"
                value={priceDraft.max !== "" ? priceDraft.max : String(maxPrice)}
                min={bounds.min}
                max={bounds.max}
                onChange={(e) => setPriceDraft((d) => ({ ...d, max: e.target.value }))}
                onBlur={() => { update("max", priceDraft.max); setPriceDraft((d) => ({ ...d, max: "" })); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
              />
            </div>
            <p className="field__hint" style={{ marginTop: 8 }}>
              В каталоге: {formatPrice(bounds.min)} — {formatPrice(bounds.max)}
            </p>
          </>
        )}
      </div>

      <div className="filter-group">
        <button
          type="button"
          className="filter-group__btn"
          aria-expanded={openGroups.weight}
          onClick={() => setOpenGroups((s) => ({ ...s, weight: !s.weight }))}
        >
          Размер <IconPlus size={12} />
        </button>
        {openGroups.weight && (
          <div className="chips">
            {WEIGHTS.map((w) => (
              <button
                key={w.id}
                type="button"
                className="chip"
                aria-pressed={weights.includes(w.id)}
                onClick={() => toggleMulti("weight", w.id)}
              >
                {w.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="filter-group">
        <button
          type="button"
          className="filter-group__btn"
          aria-expanded={openGroups.occ}
          onClick={() => setOpenGroups((s) => ({ ...s, occ: !s.occ }))}
        >
          Повод <IconPlus size={12} />
        </button>
        {openGroups.occ && (
          <div className="chips">
            {occasions.map((o) => (
              <button
                key={o}
                type="button"
                className="chip"
                aria-pressed={occ.includes(o)}
                onClick={() => toggleMulti("occ", o)}
              >
                {o}
              </button>
            ))}
          </div>
        )}
      </div>

      <a
        href={site.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn--primary btn--sm"
        style={{ marginTop: 4 }}
      >
        Не нашли нужное?
      </a>
    </>
  );

  return (
    <div className="catalog">
      <aside className="filters" data-open={filtersOpen}>
        {filtersBody}
      </aside>

      <div style={{ minWidth: 0 }}>
        <div className="toolbar">
          <div className="toolbar__left">
            <button
              type="button"
              className="btn btn--quiet btn--sm filters-toggle"
              onClick={() => setFiltersOpen((v) => !v)}
              aria-expanded={filtersOpen}
            >
              <IconFilter size={15} /> Фильтры{activeCount > 0 ? ` · ${activeCount}` : ""}
            </button>
            <span>
              <strong>{filtered.length}</strong>{" "}
              {filtered.length === 1 ? "товар" : filtered.length < 5 ? "товара" : "товаров"}
            </span>
          </div>

          <div className="toolbar__right">
            <div className="density" role="group" aria-label="Плотность сетки">
              {[5, 4, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={dens === n && view === "grid"}
                  aria-label={`${n} колонки`}
                  onClick={() => {
                    const next = new URLSearchParams(sp.toString());
                    next.set("dens", String(n));
                    next.set("view", "grid");
                    push(next);
                  }}
                >
                  <IconDensity size={16} columns={n} />
                </button>
              ))}
              <button
                type="button"
                aria-pressed={view === "list"}
                aria-label="Списком"
                onClick={() => {
                  const next = new URLSearchParams(sp.toString());
                  next.set("view", "list");
                  push(next);
                }}
              >
                <IconGrid size={15} />
              </button>
            </div>

            <div className="select">
              <label className="sr-only" htmlFor="sort">
                Сортировка
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => update("sort", e.target.value)}
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <IconChevronDown size={12} />
            </div>
          </div>
        </div>

        {activeCount > 0 && (
          <div className="active-filters">
            {q && (
              <button type="button" onClick={() => update("q", null)}>
                «{q}» <IconClose size={10} />
              </button>
            )}
            {cats.map((c) => (
              <button key={c} type="button" onClick={() => toggleMulti("cat", c)}>
                {categories.find((x) => x.slug === c)?.name ?? c} <IconClose size={10} />
              </button>
            ))}
            {occ.map((o) => (
              <button key={o} type="button" onClick={() => toggleMulti("occ", o)}>
                {o} <IconClose size={10} />
              </button>
            ))}
            {weights.map((w) => (
              <button key={w} type="button" onClick={() => toggleMulti("weight", w)}>
                {WEIGHTS.find((x) => x.id === w)?.label} <IconClose size={10} />
              </button>
            ))}
            {(minPrice > bounds.min || maxPrice < bounds.max) && (
              <button
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(sp.toString());
                  next.delete("min");
                  next.delete("max");
                  push(next);
                }}
              >
                {minPrice > 0 ? formatPrice(minPrice) : "0 ₸"} — {formatPrice(maxPrice)}{" "}
                <IconClose size={10} />
              </button>
            )}
          </div>
        )}

        {shown.length > 0 ? (
          <>
            <div
              className={`grid-products${view === "list" ? " grid-products--list" : dens === 4 ? " grid-products--4" : dens === 3 ? " grid-products--3" : ""}`}
            >
              {shown.map((p, i) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  variant={view === "list" ? "row" : "grid"}
                  priority={i < 3}
                  sizes={view === "list" ? "210px" : dens === 3 ? "33vw" : dens === 4 ? "25vw" : "20vw"}
                />
              ))}
            </div>

            <div className="load-more">
              {shown.length < filtered.length ? (
                <>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setLimit((l) => l + PAGE)}
                  >
                    Показать ещё
                  </button>
                  <span className="load-more__count">
                    {shown.length} из {filtered.length}
                  </span>
                </>
              ) : (
                <span className="load-more__count">
                  Показано {filtered.length} из {filtered.length}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="empty">
            <span className="eyebrow">Ничего не найдено</span>
            <h3>Под эти фильтры товаров нет</h3>
            <p>
              Попробуйте изменить диапазон цены или снять часть фильтров. Если нужного набора нет
              в каталоге, его можно собрать индивидуально.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <button type="button" className="btn btn--primary" onClick={resetAll}>
                Сбросить фильтры
              </button>
              <Link href="/custom" className="btn btn--ghost">
                Набор на заказ <IconArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
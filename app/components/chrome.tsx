"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { nav, site } from "../lib/site";
import { formatPrice } from "../lib/format";
import { useStore } from "./store";
import {
  IconArrowRight,
  IconBag,
  IconClose,
  IconGrid,
  IconHeart,
  IconHome,
  IconInstagram,
  IconMenu,
  IconPhone,
  IconSearch,
  IconSparkle,
  IconTrash,
  IconWhatsapp,
} from "./icons";

export function Chrome() {
  const pathname = usePathname();
  const { panel, setPanel, count, lines, subtotal, catalog, setQty, removeLine, hydrated } =
    useStore();
  const [bump, setBump] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 520);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  useEffect(() => {
    setPanel(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Content is visible by default (see globals.css). The "reveal-pending" class
    // is only added to elements that are below the viewport, so a failed observer
    // can never leave the catalog blank.
    let observerDelivered = false;
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              observerDelivered = true;
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-in");
                observer?.unobserve(entry.target);
              });
            },
            { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
          );

    const isHidden = (node: HTMLElement) =>
      node.closest("[hidden]") !== null || node.getClientRects().length === 0;

    const prepare = (node: HTMLElement) => {
      if (node.classList.contains("is-in") || isHidden(node)) return;

      if (!observer) {
        node.classList.add("is-in");
        return;
      }

      // Already in view (or above it after a jump/restore) — show it right away.
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight - 36 || rect.bottom < 0) {
        node.classList.add("is-in");
        return;
      }

      node.classList.add("reveal-pending");
      observer.observe(node);
    };

    const prepareTree = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches("[data-reveal]")) prepare(root);
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach(prepare);
    };

    prepareTree(document);

    // Cards can appear later (filters, sorting, «показать ещё», streaming).
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((added) => {
          if (added instanceof HTMLElement) prepareTree(added);
        });
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    // Safety net: if the page is jumped (scrollbar, anchor, restore), elements that
    // skipped the viewport must not stay invisible.
    let ticking = false;
    const sweep = () => {
      ticking = false;
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((node) => {
        if (isHidden(node)) return;
        if (node.getBoundingClientRect().top < window.innerHeight - 40) {
          node.classList.add("is-in");
        }
      });
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sweep);
    };

    // Absolute failsafe: if IntersectionObserver never delivers an entry (some
    // background/embedded browsers), make every pending element visible again.
    const failsafe = window.setTimeout(() => {
      if (observerDelivered) return;
      document
        .querySelectorAll<HTMLElement>("[data-reveal].reveal-pending:not(.is-in)")
        .forEach((node) => {
          if (!isHidden(node)) node.classList.add("is-in");
        });
    }, 3000);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pageshow", sweep);
    sweep();

    return () => {
      observer?.disconnect();
      mutations.disconnect();
      window.clearTimeout(failsafe);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pageshow", sweep);
    };
  }, [pathname]);

  const isHome = pathname === "/";
  const isCatalog = pathname.startsWith("/catalog");
  const isFavorites = pathname.startsWith("/favorites");
  const isCustom = pathname.startsWith("/custom");

  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="container site-header__inner">
          <Link href="/" className="site-logo">
            <span className="site-logo__mark" aria-hidden>
              CS
            </span>
            <span className="site-logo__text">
              Choco
              <small>Strawberry · {site.city}</small>
            </span>
          </Link>

          <nav className="site-nav" aria-label="Категории каталога">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="site-nav__item"
                aria-current={
                  item.href === "/catalog"
                    ? isCatalog
                      ? "page"
                      : undefined
                    : pathname === item.href
                      ? "page"
                      : undefined
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-actions">
            <a className="site-phone" href={site.phoneHref} aria-label={`Позвонить ${site.phone}`}>
              <IconPhone size={15} />
              <span>{site.phone}</span>
            </a>
            <button
              type="button"
              className="site-icon site-icon--search"
              onClick={() => setPanel(panel === "search" ? null : "search")}
              aria-label="Поиск по каталогу"
              aria-expanded={panel === "search"}
            >
              <IconSearch size={19} />
            </button>
            <Link
              href="/favorites"
              className="site-icon site-icon--fav"
              aria-label="Избранное"
              aria-current={isFavorites ? "page" : undefined}
            >
              <IconHeart size={19} />
            </Link>
            <button
              type="button"
              className="site-icon"
              onClick={() => setPanel(panel === "cart" ? null : "cart")}
              aria-label={`Корзина, товаров: ${count}`}
              aria-expanded={panel === "cart"}
            >
              <IconBag size={19} />
              {hydrated && count > 0 && (
                <span className={`site-icon__count${bump ? " site-icon__count--bump" : ""}`}>
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              className="site-icon site-burger"
              onClick={() => setPanel(panel === "menu" ? null : "menu")}
              aria-label="Открыть меню"
              aria-expanded={panel === "menu"}
            >
              <IconMenu size={21} />
            </button>
          </div>
        </div>
      </header>

      <nav
        className={`dock${pathname.startsWith("/product") ? " dock--product" : ""}`}
        aria-label="Быстрая навигация"
      >
        <div className="dock__group">
          <Link
            href="/"
            className="dock__item"
            aria-label="Главная"
            aria-current={isHome ? "page" : undefined}
          >
            <IconHome size={21} />
          </Link>
          <Link
            href="/catalog"
            className="dock__item"
            aria-label="Каталог"
            aria-current={isCatalog ? "page" : undefined}
          >
            <IconGrid size={21} />
          </Link>
          <Link
            href="/favorites"
            className="dock__item"
            aria-label="Избранное"
            aria-current={isFavorites ? "page" : undefined}
          >
            <IconHeart size={21} />
          </Link>
          <Link
            href="/custom"
            className="dock__item"
            aria-label="Набор на заказ"
            aria-current={isCustom ? "page" : undefined}
          >
            <IconSparkle size={21} />
          </Link>
        </div>
        <button
          type="button"
          className="dock__search"
          onClick={() => setPanel(panel === "search" ? null : "search")}
          aria-label="Поиск по каталогу"
          aria-expanded={panel === "search"}
        >
          <IconSearch size={20} />
        </button>
      </nav>

      {panel && <div className="overlay" onClick={() => setPanel(null)} aria-hidden />}

      {panel === "menu" && <MenuPanel onClose={() => setPanel(null)} />}
      {panel === "search" && <SearchPanel onClose={() => setPanel(null)} />}
      {panel === "cart" && (
        <CartPanel
          onClose={() => setPanel(null)}
          lines={lines}
          subtotal={subtotal}
          catalog={catalog}
          setQty={setQty}
          removeLine={removeLine}
        />
      )}
    </>
  );
}

function MenuPanel({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <div className="panel menu-panel" role="dialog" aria-modal="true" aria-label="Меню">
      <div className="menu-panel__head">
        <Link href="/" className="site-logo" onClick={onClose}>
          <span className="site-logo__mark" aria-hidden>
            CS
          </span>
          <span className="site-logo__text">
            Choco
            <small>Strawberry · {site.city}</small>
          </span>
        </Link>
        <button
          ref={closeRef}
          type="button"
          className="panel__close"
          onClick={onClose}
          aria-label="Закрыть меню"
        >
          <IconClose size={16} />
        </button>
      </div>

      <div className="menu-panel__body">
        <span className="menu-panel__label">Каталог</span>
        <nav aria-label="Категории каталога" className="menu-panel__nav">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="menu-panel__link"
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <span className="menu-panel__label">Покупателям</span>
        <nav aria-label="Разделы сайта" className="menu-panel__grid">
          <Link href="/favorites" className="menu-panel__cell" onClick={onClose}>
            Избранное
          </Link>
          <Link href="/delivery" className="menu-panel__cell" onClick={onClose}>
            Доставка
          </Link>
          <Link href="/about" className="menu-panel__cell" onClick={onClose}>
            О нас
          </Link>
          <Link href="/contacts" className="menu-panel__cell" onClick={onClose}>
            Контакты
          </Link>
        </nav>
      </div>

      <div className="menu-panel__foot">
        <a className="menu-panel__phone" href={site.phoneHref}>
          <IconPhone size={16} /> {site.phone}
        </a>
        <div className="menu-panel__social">
          <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer">
            <IconWhatsapp size={15} /> WhatsApp
          </a>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            <IconInstagram size={15} /> {site.instagramHandle}
          </a>
        </div>
        <p className="menu-panel__meta">
          {site.city} · {site.address}
          <br />
          {site.hours}
        </p>
      </div>
    </div>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const { catalog } = useStore();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const all = useMemo(() => Object.values(catalog), [catalog]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all.slice(0, 5);
    return all
      .filter((p) => `${p.name} ${p.kind}`.toLowerCase().includes(q))
      .slice(0, 7);
  }, [all, query]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    onClose();
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
  }

  return (
    <div className="panel search-panel" role="dialog" aria-modal="true" aria-label="Поиск по каталогу">
      <form onSubmit={submit} className="search-panel__field">
        <IconSearch size={22} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Клубника, сердце, финики…"
          aria-label="Поисковый запрос"
          autoComplete="off"
        />
        <button type="button" className="panel__close" onClick={onClose} aria-label="Закрыть поиск">
          <IconClose size={16} />
        </button>
      </form>

      {results.length > 0 ? (
        <div className="search-results">
          {results.map((p) => (
            <Link key={p.slug} href={`/product/${p.slug}`} className="search-results__item" onClick={onClose}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt="" loading="lazy" />
              <span>
                <span className="search-results__name">{p.name}</span>
                <span className="search-results__kind">{p.kind}</span>
              </span>
              <span className="search-results__price">
                {p.priceFrom > 0 ? `от ${formatPrice(p.priceFrom)}` : "по запросу"}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="search-empty">
          По запросу «{query}» ничего не нашлось. Попробуйте «клубника», «сердце» или{" "}
          <Link href="/custom" onClick={onClose} style={{ textDecoration: "underline" }}>
            оставьте заявку на индивидуальный набор
          </Link>
          .
        </div>
      )}

      {query.trim() && results.length > 0 && (
        <div style={{ padding: "4px 16px 18px" }}>
          <button type="submit" className="btn btn--primary btn--sm btn--block" onClick={submit}>
            Все результаты <IconArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function CartPanel({
  onClose,
  lines,
  subtotal,
  catalog,
  setQty,
  removeLine,
}: {
  onClose: () => void;
  lines: ReturnType<typeof useStore>["lines"];
  subtotal: number;
  catalog: ReturnType<typeof useStore>["catalog"];
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
}) {
  return (
    <div className="panel cart-panel" role="dialog" aria-modal="true" aria-label="Корзина">
      <div className="panel__head">
        <span className="panel__title">Корзина{lines.length > 0 ? ` · ${lines.length}` : ""}</span>
        <button type="button" className="panel__close" onClick={onClose} aria-label="Закрыть корзину">
          <IconClose size={16} />
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="cart-empty">
          В корзине пока пусто.
          <br />
          Начните с набора клубники — его проще всего подарить.
          <div>
            <Link href="/catalog/sets" className="btn btn--primary btn--sm" onClick={onClose}>
              Смотреть наборы
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="cart-lines">
            {lines.map((line) => {
              const product = catalog[line.slug];
              const option = product?.options.find((o) => o.id === line.optionId);
              if (!product || !option) return null;
              return (
                <div className="cart-line" key={line.key}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt="" loading="lazy" />
                  <div>
                    <div className="cart-line__name">{product.name}</div>
                    <div className="cart-line__opt">
                      {option.label} · {option.portions}
                    </div>
                    {line.message && <div className="cart-line__msg">«{line.message}»</div>}
                    {line.date && (
                      <div className="cart-line__msg">
                        Дата: {new Date(`${line.date}T12:00:00`).toLocaleDateString("ru-RU")}
                      </div>
                    )}
                    <div className="cart-line__price">{formatPrice(option.price * line.qty)}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <div className="qty">
                      <button type="button" onClick={() => setQty(line.key, line.qty - 1)} aria-label="Уменьшить количество">
                        −
                      </button>
                      <span aria-live="polite">{line.qty}</span>
                      <button type="button" onClick={() => setQty(line.key, line.qty + 1)} aria-label="Увеличить количество">
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="cart-row__remove"
                      onClick={() => removeLine(line.key)}
                      aria-label={`Удалить ${product.name}`}
                      style={{ color: "var(--muted)" }}
                    >
                      <IconTrash size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cart-foot">
            <div className="cart-foot__row">
              <span>Всего</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <Link href="/checkout" className="btn btn--primary btn--block" onClick={onClose}>
              Перейти к оформлению
            </Link>
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <Link
                href="/cart"
                onClick={onClose}
                style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)" }}
              >
                Открыть корзину
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}



"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CartLine } from "../lib/types";
import { track } from "../lib/analytics";

export type ClientProduct = {
  slug: string;
  name: string;
  kind: string;
  image: string;
  priceFrom: number;
  options: { id: string; label: string; price: number; portions: string; weightKg: number }[];
};

type Panel = "menu" | "search" | "cart" | null;

type StoreValue = {
  catalog: Record<string, ClientProduct>;
  lines: CartLine[];
  hydrated: boolean;
  count: number;
  subtotal: number;
  addLine: (slug: string, optionId: string, qty?: number, message?: string, date?: string) => void;
  setQty: (key: string, qty: number) => void;
  setMessage: (key: string, message: string) => void;
  removeLine: (key: string) => void;
  clear: () => void;
  panel: Panel;
  setPanel: (p: Panel) => void;
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  lastAdded: string | null;
};

const StoreContext = createContext<StoreValue | null>(null);
const CART_KEY = "chocostrawberry:cart:v1";
const FAV_KEY = "chocostrawberry:favorites:v1";

export function StoreProvider({
  products,
  children,
}: {
  products: ClientProduct[];
  children: React.ReactNode;
}) {
  const catalog = useMemo(
    () => Object.fromEntries(products.map((p) => [p.slug, p])),
    [products]
  );
  const [lines, setLines] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const rawCart = localStorage.getItem(CART_KEY);
      if (rawCart) {
        const parsed = JSON.parse(rawCart) as CartLine[];
        if (Array.isArray(parsed)) {
          setLines(parsed.filter((l) => l && catalog[l.slug] && catalog[l.slug].options.some((o) => o.id === l.optionId)));
        }
      }
      const rawFav = localStorage.getItem(FAV_KEY);
      if (rawFav) {
        const parsed = JSON.parse(rawFav) as string[];
        if (Array.isArray(parsed)) setFavorites(parsed.filter((s) => catalog[s]));
      }
    } catch {
      /* повреждённое хранилище игнорируем */
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  useEffect(() => {
    document.body.classList.toggle("is-locked", panel !== null);
    return () => document.body.classList.remove("is-locked");
  }, [panel]);

  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panel]);

  const addLine = useCallback(
    (slug: string, optionId: string, qty = 1, message?: string, date?: string) => {
      const product = catalog[slug];
      const option = product?.options.find((o) => o.id === optionId);
      if (!product || !option) return;
      const key = `${slug}::${optionId}`;
      setLines((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (existing) {
          return prev.map((l) =>
            l.key === key
              ? {
                  ...l,
                  qty: Math.min(99, l.qty + qty),
                  message: message ?? l.message,
                  date: date ?? l.date,
                }
              : l
          );
        }
        return [...prev, { key, slug, optionId, qty: Math.min(99, qty), message, date }];
      });
      setLastAdded(slug);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setLastAdded(null), 1600);
      track("add_to_cart", {
        item_id: slug,
        item_name: product.name,
        item_variant: option.label,
        value: option.price * qty,
        currency: "KZT",
        quantity: qty,
      });
    },
    [catalog]
  );

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(99, qty) } : l))
    );
  }, []);

  const setMessage = useCallback((key: string, message: string) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, message } : l)));
  }, []);

  const removeLine = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);

  const subtotal = useMemo(
    () =>
      lines.reduce((sum, l) => {
        const option = catalog[l.slug]?.options.find((o) => o.id === l.optionId);
        return sum + (option ? option.price * l.qty : 0);
      }, 0),
    [lines, catalog]
  );

  const value: StoreValue = {
    catalog,
    lines,
    hydrated,
    count,
    subtotal,
    addLine,
    setQty,
    setMessage,
    removeLine,
    clear,
    panel,
    setPanel,
    favorites,
    toggleFavorite,
    lastAdded,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

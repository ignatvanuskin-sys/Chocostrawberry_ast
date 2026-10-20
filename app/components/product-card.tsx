"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "../lib/types";
import { formatPrice, priceFrom } from "../lib/format";
import { useStore } from "./store";
import { IconArrowRight, IconPlus } from "./icons";

const badgeLabel: Record<Product["badges"][number], string> = {
  hit: "Хит",
  new: "Новинка",
  seasonal: "Сезон",
};

export function ProductCard({
  product,
  variant = "grid",
  priority = false,
  sizes,
}: {
  product: Product;
  variant?: "grid" | "row";
  priority?: boolean;
  sizes?: string;
}) {
  const { addLine, setPanel } = useStore();
  const first = product.options[0];
  const price = priceFrom(product);
  const onRequest = price <= 0;
  const hasRange = !onRequest && product.options.some((o) => o.price !== price);
  const isRow = variant === "row";

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addLine(product.slug, first.id, 1);
    setPanel("cart");
  }

  return (
    <article className={`card${isRow ? " card--row" : ""}`} data-reveal>
      <Link
        href={`/product/${product.slug}`}
        className="card__hit"
        aria-label={onRequest ? `${product.name} — цена по запросу` : `${product.name} — от ${formatPrice(price)}`}
      >
        <span className="sr-only">{product.name}</span>
      </Link>

      <div className="card__media">
        <Image
          src={product.images[0].src}
          alt={product.images[0].alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"}
          priority={priority}
        />
        {!isRow && product.badges.length > 0 && (
          <div className="card__badges">
            {product.badges.map((b) => (
              <span key={b} className={`card__badge${b === "hit" ? " card__badge--hit" : ""}`}>
                {badgeLabel[b]}
              </span>
            ))}
          </div>
        )}
      </div>

      {!isRow && !onRequest && (
        <button
          type="button"
          className="card__add"
          onClick={quickAdd}
          aria-label={`Добавить «${product.name}» в корзину`}
        >
          <IconPlus size={16} />
        </button>
      )}

      <div className="card__details">
        <div className="card__title">{product.name}</div>
        {isRow && <p className="card__desc">{product.subtitle}</p>}
        <div className="card__meta">
          {product.kind}
          {product.options.length > 1
            ? ` · ${product.options.length} варианта`
            : ` · ${product.options[0].portions}`}
        </div>
        <div className="card__price">
          {onRequest ? (
            "по запросу"
          ) : (
            <>
              {hasRange ? "от " : ""}
              {formatPrice(price)}
              {!hasRange && <span>{product.options[0].label}</span>}
            </>
          )}
        </div>
        {isRow && (
          <span className="card__rowlink">
            Подробнее <IconArrowRight size={14} />
          </span>
        )}
      </div>
    </article>
  );
}

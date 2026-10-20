import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getCatalog, getProducts, formatPrice, priceFrom } from "./lib/products";
import { site } from "./lib/site";
import { ProductCard } from "./components/product-card";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconClock,
  IconInstagram,
  IconPin,
  IconStar,
  IconWhatsapp,
} from "./components/icons";

export const metadata: Metadata = {
  title: `${site.name} — клубника и финики в шоколаде в Астане`,
  description: site.description,
  alternates: { canonical: "/" },
};

const reviews = [
  {
    text: "Очень вкусная клубника в шоколаде! И свежая! Всем рекомендую! Теперь только тут буду заказывать!",
    author: "Zhibek Ospanova",
    date: "14.10.2026",
  },
  {
    text: "Вкусная клубника. Очень понравилось разнообразие вкусов — дубайский, кантри. Буду заказывать ещё.",
    author: "Valeriya Z",
    date: "17.10.2026",
  },
  {
    text: "Лучшая клубника, которую я пробовала: крупная, шоколад вкусный. Очень пунктуальные. Обязательно буду заказывать ещё.",
    author: "Z А",
    date: "01.10.2026",
  },
];

const gallery = [
  { src: "/images/products/premium-serdce-s.jpg", cap: "Сердце с клубникой" },
  { src: "/images/products/nabor-m.jpg", cap: "Набор M" },
  { src: "/images/products/buket-33-35.jpg", cap: "Букет из клубники" },
  { src: "/images/products/premium-serdce-m.jpg", cap: "Сердце M" },
  { src: "/images/products/nabor-lyubimye.jpg", cap: "Набор «Любимые»" },
  { src: "/images/products/premium-serdce-finiki.jpg", cap: "Сердце из фиников" },
  { src: "/images/products/nabor-yagody.jpg", cap: "Ягоды и фрукты" },
  { src: "/images/products/boks-pozdravlenie.jpg", cap: "Подарочный бокс" },
];

export default function HomePage() {
  const { categories } = getCatalog();
  const products = getProducts();
  const heroProduct = products.find((p) => p.slug === "premium-serdce-s")!;
  const popular = [...products]
    .sort((a, b) => {
      const score = (p: typeof a) => (p.badges.includes("hit") ? 2 : p.badges.includes("new") ? 1 : 0);
      return score(b) - score(a) || (a.createdAt < b.createdAt ? 1 : -1);
    })
    .slice(0, 10);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="hero" aria-label={site.name}>
        <div className="hero__copy">
          <div className="hero__eyebrow">{site.city} · Клубника в шоколаде</div>
          <h1 className="hero__title">
            <span>Ягоды</span>
            <span>в шоколаде</span>
            <span>для важных</span>
            <em>моментов</em>
          </h1>
          <p className="hero__text">
            Клубника и финики в бельгийском шоколаде. Собираем наборы, сердца и букеты вручную,
            доставляем по Астане и работаем круглосуточно.
          </p>
          <div className="hero__cta">
            <Link href="/catalog" className="btn btn--primary btn--lg">
              Выбрать набор
            </Link>
            <Link href="/custom" className="btn btn--ghost btn--lg">
              Собрать свой набор <IconArrowRight size={15} />
            </Link>
          </div>
          <div className="hero__meta">
            <span>
              <strong>{site.rating.value}</strong> ★ · {site.rating.ratings} оценок в{" "}
              {site.rating.source}
            </span>
            <i className="sep" aria-hidden />
            <span>Доставка по Астане</span>
            <i className="sep" aria-hidden />
            <span>{site.hoursShort}</span>
          </div>
        </div>

        <div className="hero__media">
          <Image
            src="/images/hero/hero.jpg"
            alt="Сердце с клубникой и малиной в шоколаде"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          <span className="hero__scroll">Chocostrawberry · Астана</span>
          <Link href={`/product/${heroProduct.slug}`} className="hero__card">
            <span>
              <span className="hero__card-kicker">Хит продаж</span>
              <span className="hero__card-name">{heroProduct.name}</span>
              <span className="hero__card-price">от {formatPrice(priceFrom(heroProduct))}</span>
            </span>
            <span className="hero__card-arrow">
              <IconArrowUpRight size={16} />
            </span>
          </Link>
        </div>
      </section>

      {/* ---------------- QUICK CATEGORIES (mobile) ---------------- */}
      <nav className="quick-cats" aria-label="Быстрый переход по категориям">
        {categories.slice(0, 6).map((cat) => (
          <Link key={cat.slug} href={`/catalog/${cat.slug}`} className="quick-cats__item">
            {cat.name}
          </Link>
        ))}
        <Link href="/catalog" className="quick-cats__item quick-cats__item--all">
          Весь каталог
        </Link>
      </nav>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="section section--tight" data-reveal>
        <div className="container">
          <div className="section-head">
            <div className="section-head__label">
              <span className="eyebrow">01 — Каталог</span>
              <h2>Клубника, сердца и финики</h2>
            </div>
            <Link href="/catalog" className="link-arrow">
              Все товары <IconArrowRight size={14} />
            </Link>
          </div>

          <div className="cats">
            {categories.slice(0, 3).map((cat) => (
              <Link key={cat.slug} href={`/catalog/${cat.slug}`} className="cat">
                <div className="cat__media">
                  <Image src={cat.image} alt={cat.name} fill sizes="(max-width: 1024px) 50vw, 24vw" />
                  <span className="cat__veil" aria-hidden />
                  <span className="cat__label">
                    <span className="cat__name">{cat.name}</span>
                    <span className="cat__count">
                      {products.filter((p) => p.categories.includes(cat.slug)).length} поз.
                    </span>
                  </span>
                </div>
              </Link>
            ))}

            <div className="cat cat--all">
              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}>
                  Все категории
                </div>
                <div className="cat__big">
                  Есть
                  <br />
                  из чего
                  <br />
                  выбрать
                </div>
              </div>
              <nav className="cat__list" aria-label="Остальные категории">
                {categories.slice(3).map((cat) => (
                  <Link key={cat.slug} href={`/catalog/${cat.slug}`}>
                    {cat.name}
                  </Link>
                ))}
              </nav>
              <Link href="/catalog" className="cat__go">
                Открыть каталог <IconArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- POPULAR ---------------- */}
      <section className="section section--tight" data-reveal>
        <div className="container">
          <div className="section-head">
            <div className="section-head__label">
              <span className="eyebrow">02 — Чаще всего заказывают</span>
              <h2>Хиты и новинки</h2>
            </div>
            <Link href="/catalog?sort=popular" className="link-arrow">
              Смотреть каталог <IconArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-products grid-products--home">
            {popular.map((product, i) => (
              <ProductCard key={product.slug} product={product} priority={i < 5} />
            ))}
          </div>

          <Link
            href="/catalog?sort=popular"
            className="btn btn--ghost btn--block mobile-only"
            style={{ marginTop: 14 }}
          >
            Все хиты в каталоге <IconArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ---------------- HEARTS SPLIT ---------------- */}
      <section className="section section--tight" data-reveal>
        <div className="container">
          <div className="split">
            <div className="split__media">
              <Image
                src="/images/products/category-hearts.jpg"
                alt="Сердце из клубники и малины в шоколаде"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
            <div className="split__body">
              <span className="eyebrow">03 — Сердца и букеты</span>
              <h2>
                Сердце,
                <br />
                которое можно съесть
              </h2>
              <p className="lead" style={{ fontSize: 14 }}>
                Сердце из свежей клубники в бельгийском шоколаде — подарок, который не нужно
                ставить в вазу. Размер, шоколад, ленту и надпись согласуем перед сборкой.
              </p>
              <div className="feature-list">
                <div className="feature">
                  <span className="feature__num">01</span>
                  <div>
                    <div className="feature__name">Свежие ягоды</div>
                    <p className="feature__text">
                      Клубнику перебираем и собираем набор в день передачи.
                    </p>
                  </div>
                </div>
                <div className="feature">
                  <span className="feature__num">02</span>
                  <div>
                    <div className="feature__name">Бельгийский шоколад</div>
                    <p className="feature__text">
                      Молочный, тёмный или белый — подбираем под ваш вкус.
                    </p>
                  </div>
                </div>
                <div className="feature">
                  <span className="feature__num">03</span>
                  <div>
                    <div className="feature__name">Упаковка и открытка</div>
                    <p className="feature__text">
                      Коробка, лента и подпись — набор можно сразу везти в гости.
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
                <Link href="/catalog/hearts" className="btn btn--primary">
                  Смотреть сердца
                </Link>
                <a
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost"
                >
                  <IconWhatsapp size={16} /> Спросить
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CUSTOM CTA ---------------- */}
      <section className="cta-band" data-reveal>
        <div className="container cta-band__inner">
          <div>
            <span className="eyebrow">04 — Индивидуальный заказ</span>
            <h2>
              Набор,
              <br />
              которого ещё не было
            </h2>
            <p>
              Расскажите о поводе, размере и оформлении — предложим состав и назовём стоимость.
              Заявка не является заказом: сначала согласуем детали и дату.
            </p>
            <div className="cta-band__actions">
              <Link href="/custom" className="btn btn--light btn--lg">
                Собрать заявку
              </Link>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost btn--lg"
              >
                <IconWhatsapp size={16} /> WhatsApp
              </a>
            </div>
          </div>
          <div className="steps">
            <div className="step">
              <span className="step__num">01</span>
              <div>
                <div className="step__name">Заявка</div>
                <p className="step__text">Повод, размер, шоколад, дата и пожелания по декору.</p>
              </div>
            </div>
            <div className="step">
              <span className="step__num">02</span>
              <div>
                <div className="step__name">Согласование</div>
                <p className="step__text">Кондитер уточняет состав и подтверждает стоимость.</p>
              </div>
            </div>
            <div className="step">
              <span className="step__num">03</span>
              <div>
                <div className="step__name">Оплата</div>
                <p className="step__text">Способ оплаты согласуется напрямую.</p>
              </div>
            </div>
            <div className="step">
              <span className="step__num">04</span>
              <div>
                <div className="step__name">Выдача</div>
                <p className="step__text">
                  Самовывоз с {site.address} или доставка по Астане.
                </p>
              </div>
            </div>
          </div>
        </div>
        <span className="cta-band__ghost" aria-hidden />
      </section>

      {/* ---------------- GALLERY ---------------- */}
      <section className="section section--tight" data-reveal>
        <div className="container">
          <div className="section-head">
            <div className="section-head__label">
              <span className="eyebrow">05 — Галерея</span>
              <h2>Наши наборы</h2>
            </div>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow"
            >
              <IconInstagram size={14} /> {site.instagramHandle}
            </a>
          </div>
        </div>
        <div className="marquee" aria-label="Галерея наборов">
          <div className="marquee__track">
            {[...gallery, ...gallery].map((item, i) => (
              <figure className="marquee__item" key={`${item.src}-${i}`}>
                <Image src={item.src} alt={item.cap} fill sizes="320px" loading="lazy" />
                <figcaption className="marquee__cap">{item.cap}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- REVIEWS ---------------- */}
      <section className="section section--tight" data-reveal>
        <div className="container">
          <div className="section-head">
            <div className="section-head__label">
              <span className="eyebrow">06 — Отзывы</span>
              <h2>Что говорят гости</h2>
            </div>
            <a
              href={`${site.mapUrl}/tab/reviews`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow"
            >
              {site.rating.reviews} отзыва в {site.rating.source} <IconArrowUpRight size={13} />
            </a>
          </div>

          <div className="reviews">
            <div className="reviews__score">
              <div className="reviews__value">
                {site.rating.value}
                <small>/ 5</small>
              </div>
              <div className="stars" role="img" aria-label={`Оценка ${site.rating.value} из 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar key={i} size={16} />
                ))}
              </div>
              <p className="meta" style={{ textTransform: "none", letterSpacing: 0 }}>
                {site.rating.ratings} оценок и {site.rating.reviews} отзывов в {site.rating.source}.
                Отзывы опубликованы на карточке компании.
              </p>
              <a
                href={site.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost btn--sm"
                style={{ alignSelf: "flex-start" }}
              >
                Открыть в {site.rating.source} <IconArrowUpRight size={13} />
              </a>
            </div>

            <div className="review-grid" role="region" aria-label="Отзывы гостей" tabIndex={0}>
              {reviews.map((r) => (
                <figure className="review" key={r.author}>
                  <div className="stars" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <IconStar key={i} size={12} />
                    ))}
                  </div>
                  <blockquote className="review__text">«{r.text}»</blockquote>
                  <figcaption className="review__foot">
                    <span className="review__author">{r.author}</span>
                    <span>{r.date}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- DELIVERY ---------------- */}
      <section className="section section--tight" id="delivery" data-reveal>
        <div className="container">
          <div className="section-head">
            <div className="section-head__label">
              <span className="eyebrow">07 — Получение</span>
              <h2>Доставка и самовывоз</h2>
            </div>
            <Link href="/delivery" className="link-arrow">
              Подробнее <IconArrowRight size={14} />
            </Link>
          </div>

          <div className="delivery">
            <div className="delivery__col">
              <div className="eyebrow">Доставка</div>
              <h3 style={{ fontSize: "var(--fs-h3)" }}>По Астане</h3>
              <p className="lead" style={{ fontSize: 14 }}>
                Доставляем наборы по городу. Стоимость и время зависят от адреса и загрузки —
                уточняйте при оформлении заказа.
              </p>
              <div>
                <div className="delivery__row">
                  <span>Зона</span>
                  <span>Астана</span>
                </div>
                <div className="delivery__row">
                  <span>Стоимость</span>
                  <span>уточняется при заказе</span>
                </div>
                <div className="delivery__row">
                  <span>Срочные заказы</span>
                  <span>по согласованию</span>
                </div>
                <div className="delivery__row">
                  <span>Часы</span>
                  <span>{site.hoursShort}</span>
                </div>
              </div>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
                style={{ alignSelf: "flex-start" }}
              >
                <IconWhatsapp size={16} /> Рассчитать доставку
              </a>
            </div>

            <div className="delivery__col">
              <div className="eyebrow">Самовывоз</div>
              <h3 style={{ fontSize: "var(--fs-h3)" }}>{site.address}</h3>
              <p className="lead" style={{ fontSize: 14 }}>
                {site.district}, {site.city}. Забрать заказ можно ежедневно в любое время — адрес и
                готовность подтвердим в переписке.
              </p>
              <div>
                <div className="delivery__row">
                  <span>Адрес</span>
                  <span>{site.address}</span>
                </div>
                <div className="delivery__row">
                  <span>Режим</span>
                  <span>{site.hours}</span>
                </div>
                <div className="delivery__row">
                  <span>Телефон</span>
                  <span>{site.phone}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a
                  href={site.routeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost"
                >
                  <IconPin size={16} /> Маршрут в 2ГИС
                </a>
                <Link href="/contacts" className="btn btn--ghost">
                  <IconClock size={16} /> Контакты
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

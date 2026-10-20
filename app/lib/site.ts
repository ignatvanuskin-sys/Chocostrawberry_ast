/**
 * Публичные данные компании.
 * Источники: карточка 2ГИС, Instagram и визитка компании (август 2026).
 * Цены и состав — из актуального прайса 2ГИС; условия доставки уточняются у кондитера.
 */
export const site = {
  name: "Chocostrawberry",
  wordmark: "CHOCO",
  wordmarkSub: "STRAWBERRY",
  legalName: "Chocostrawberry_ast",
  tagline: "Клубника и финики в шоколаде",
  description:
    "Клубника и финики в бельгийском шоколаде в Астане. Подарочные наборы, сердца и букеты, доставка по городу и самовывоз. Ежедневно, круглосуточно.",

  // 2ГИС: Chocostrawberry_ast, проспект Мангилик Ел, 51/3
  address: "проспект Мангилик Ел, 51/3",
  city: "Астана",
  district: "Есиль район",
  addressFull: "Астана, Есиль район, проспект Мангилик Ел, 51/3",
  hours: "Ежедневно, круглосуточно",
  hoursShort: "24/7",
  phone: "+7 747 905 49 62",
  phoneHref: "tel:+77479054962",
  whatsapp: "77479054962",
  whatsappUrl: "https://wa.me/77479054962",
  instagram: "https://www.instagram.com/chocostrawberry_ast",
  instagramHandle: "@chocostrawberry_ast",
  mapUrl: "https://2gis.kz/astana/firm/70000001068416609",
  routeUrl:
    "https://2gis.kz/astana/directions/points/%7C71.423133%2C51.094726%3B70000001068416609",

  // 2ГИС, карточка компании на 06.06.2026: 5,0 · 311 оценок · 275 отзывов
  rating: {
    value: 5.0,
    ratings: 311,
    reviews: 275,
    source: "2ГИС",
  },

  /**
   * Каталог собран по карточке компании в 2ГИС. Цены указаны как ориентир;
   * наличие и итоговую стоимость подтверждает кондитер.
   */
  demo: {
    catalog: false,
    label: "цена",
  },

  /**
   * Канонический домен. На Vercel берём production-домен проекта,
   * локально — localhost. Явное значение можно передать через NEXT_PUBLIC_SITE_URL.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim()}`
      : "http://localhost:3000"),
} as const;

export const nav = [
  { href: "/catalog", label: "Все" },
  { href: "/catalog/sets", label: "Наборы" },
  { href: "/catalog/hearts", label: "Сердца" },
  { href: "/catalog/bouquets", label: "Букеты" },
  { href: "/catalog/dates", label: "Финики" },
  { href: "/catalog/boxes", label: "Боксы" },
  { href: "/custom", label: "На заказ" },
] as const;

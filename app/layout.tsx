import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";
import "./components.css";
import { site } from "./lib/site";
import { getCatalog, priceFrom } from "./lib/products";
import { StoreProvider } from "./components/store";
import { Chrome } from "./components/chrome";
import { Footer } from "./components/footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — клубника и финики в шоколаде в Астане`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "клубника в шоколаде Астана",
    "финики в шоколаде Астана",
    "набор клубники в шоколаде",
    "сердце из клубники Астана",
    "букет из клубники Астана",
    "Chocostrawberry",
  ],
  openGraph: {
    type: "website",
    locale: "ru_KZ",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — клубника и финики в шоколаде`,
    description: site.description,
    images: [
      {
        url: "/images/hero/og.jpg",
        width: 1200,
        height: 630,
        alt: "Клубника в шоколаде Chocostrawberry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — клубника и финики в шоколаде`,
    description: site.description,
    images: ["/images/hero/og.jpg"],
  },
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png" }],
  },
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#451722",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const catalog = getCatalog();

  const clientProducts = catalog.products.map((p) => ({
    slug: p.slug,
    name: p.name,
    kind: p.kind,
    image: p.images[0]?.src ?? "",
    priceFrom: priceFrom(p),
    options: p.options.map((o) => ({
      id: o.id,
      label: o.label,
      price: o.price,
      portions: o.portions,
      weightKg: o.weightKg,
    })),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: site.legalName,
    alternateName: site.name,
    description: site.description,
    url: site.url,
    image: `${site.url}/images/hero/og.jpg`,
    telephone: site.phone,
    priceRange: "₸₸",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: site.city,
      addressRegion: site.district,
      addressCountry: "KZ",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    sameAs: [site.instagram, site.mapUrl],
  };

  return (
    <html lang="ru" className="js">
      <body>
        <a className="skip-link" href="#main">
          Перейти к содержимому
        </a>
        <StoreProvider products={clientProducts}>
          <Chrome />
          <main id="main">{children}</main>
          <Footer />
        </StoreProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

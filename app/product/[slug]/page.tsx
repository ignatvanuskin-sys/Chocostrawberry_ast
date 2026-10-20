import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProducts, priceFrom, relatedProducts } from "../../lib/products";
import { ProductDetail } from "../../components/product-detail";
import { site } from "../../lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Товар не найден" };

  const title = `${product.name} — ${product.kind}`;
  const min = priceFrom(product);
  return {
    title,
    description: `${product.subtitle}. ${product.description.slice(0, 120)}… ${
      min > 0 ? `Цена от ${min} ₸` : "Цена по запросу"
    } в Астане.`,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title,
      description: product.subtitle,
      images: [{ url: product.images[0].src, alt: product.images[0].alt }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = relatedProducts(product, 5);
  const min = priceFrom(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => `${site.url}${i.src}`),
    category: product.kind,
    brand: { "@type": "Brand", name: site.name },
    ...(min > 0
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "KZT",
            lowPrice: min,
            highPrice: Math.max(...product.options.map((o) => o.price)),
            offerCount: product.options.length,
            availability: product.customizable
              ? "https://schema.org/PreOrder"
              : "https://schema.org/InStock",
            seller: { "@type": "Store", name: site.legalName },
          },
        }
      : {}),
  };

  return (
    <div className="pdp-page">
      <ProductDetail product={product} related={related} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

export async function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

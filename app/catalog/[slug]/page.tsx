import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCatalog } from "../../lib/products";
import { CatalogView } from "../../components/catalog-view";
import { site } from "../../lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCatalog().categories.find((c) => c.slug === slug);
  if (!category) return { title: "Категория не найдена" };
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/catalog/${category.slug}` },
    openGraph: {
      title: `${category.name} — ${site.name}`,
      description: category.description,
      images: [{ url: category.image }],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const { products, categories } = getCatalog();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const count = products.filter((p) => p.categories.includes(slug)).length;

  return (
    <div className="page container">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span aria-hidden>/</span>
        <Link href="/catalog">Каталог</Link>
        <span aria-hidden>/</span>
        <span>{category.name}</span>
      </nav>

      <header className="page-head">
        <div>
          <span className="eyebrow">Категория</span>
          <h1 style={{ marginTop: 10 }}>{category.name}</h1>
        </div>
        <p className="page-head__aside">
          {category.description} {count} позиций.
        </p>
      </header>

      <CatalogView products={products} categories={categories} lockedCategory={slug} />
    </div>
  );
}

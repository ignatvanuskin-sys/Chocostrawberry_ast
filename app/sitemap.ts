import type { MetadataRoute } from "next";
import { getCatalog } from "./lib/products";
import { site } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const { products, categories } = getCatalog();
  const now = new Date();

  const staticRoutes = ["", "/catalog", "/custom", "/delivery", "/about", "/contacts"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...categories.map((c) => ({
      url: `${site.url}/catalog/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${site.url}/product/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

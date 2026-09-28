import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import type { Locale } from "./site";

export type Category = {
  slug: string;
  code: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  image: string | null;
};

export type Product = {
  code: string;
  slug: string;
  category: string;
  nameAr: string;
  nameEn: string;
  dimensions: { h: number; w: number; d: number };
  material: "metal" | null;
  images: string[];
  drawing: string | null;
  featured: boolean;
  specStatus: "verified" | "needs-review" | "missing";
  source: string;
};

export const categories: Category[] = categoriesData;
export const products: Product[] = productsData as Product[];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const productsIn = (category: string) => products.filter((p) => p.category === category);

// Wrap sizes like 40×40×12 in LTR isolates so they don't reverse inside Arabic text.
const isolateSizes = (s: string) => s.replace(/\d+(?:\s*[×x*]\s*\d+)+/g, (m) => `⁦${m}⁩`);

export const productName = (p: Pick<Product, "nameAr" | "nameEn">, locale: Locale) => (locale === "ar" ? isolateSizes(p.nameAr) : p.nameEn);
export const categoryName = (c: Category, locale: Locale) => (locale === "ar" ? c.nameAr : c.nameEn);
export const categoryDesc = (c: Category, locale: Locale) => (locale === "ar" ? c.descAr : c.descEn);

export const formatDims = (d: Product["dimensions"]) => `${d.h} × ${d.w} × ${d.d}`;

export const featuredProducts = () => {
  const featured = products.filter((p) => p.featured);
  // One representative per category keeps the home page balanced.
  const extra = categories
    .map((c) => products.find((p) => p.category === c.slug && !p.featured))
    .filter((p): p is Product => Boolean(p));
  return [...featured, ...extra].slice(0, 8);
};

export const relatedProducts = (p: Product, n = 4) => products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, n);

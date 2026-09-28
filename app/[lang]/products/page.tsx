import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dict";
import { hasLocale } from "@/lib/site";
import PageHeader from "@/components/PageHeader";
import ProductBrowser from "@/components/ProductBrowser";

export async function generateMetadata({ params }: PageProps<"/[lang]/products">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDict(lang);
  return { title: t.products.title, description: t.products.intro };
}

export default async function ProductsPage({ params }: PageProps<"/[lang]/products">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);

  return (
    <>
      <PageHeader lang={lang} title={t.products.title} intro={t.products.intro} crumbs={[{ href: `/${lang}`, label: t.nav.home }]} />
      <div className="container-x py-12 lg:py-16">
        <Suspense>
          <ProductBrowser />
        </Suspense>
      </div>
    </>
  );
}

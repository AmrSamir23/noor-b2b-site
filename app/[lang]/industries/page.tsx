import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dict";
import { hasLocale } from "@/lib/site";
import PageHeader from "@/components/PageHeader";
import { SectorGrid } from "@/components/CompanySections";

export async function generateMetadata({ params }: PageProps<"/[lang]/industries">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDict(lang);
  return { title: t.industries.title, description: t.industries.intro };
}

export default async function IndustriesPage({ params }: PageProps<"/[lang]/industries">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);

  return (
    <>
      <PageHeader lang={lang} title={t.industries.title} intro={t.industries.intro} crumbs={[{ href: `/${lang}`, label: t.nav.home }]} />
      <div className="container-x section">
        <SectorGrid lang={lang} withText />
      </div>
    </>
  );
}

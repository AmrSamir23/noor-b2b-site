import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dict";
import { hasLocale } from "@/lib/site";
import PageHeader from "@/components/PageHeader";
import QuoteForm from "@/components/QuoteForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/quote">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDict(lang);
  return { title: t.quote.title, description: t.quote.intro };
}

export default async function QuotePage({ params }: PageProps<"/[lang]/quote">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);

  return (
    <>
      <PageHeader lang={lang} title={t.quote.title} intro={t.quote.intro} crumbs={[{ href: `/${lang}`, label: t.nav.home }]} />
      <div className="bg-surface">
        <div className="container-x py-12 lg:py-16">
          <Suspense>
            <QuoteForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}

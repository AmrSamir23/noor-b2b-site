import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dict";
import { hasLocale } from "@/lib/site";
import PageHeader from "@/components/PageHeader";
import { ClientLogos, ProjectGrid } from "@/components/CompanySections";
import { buttonVariants } from "@/components/ui/button";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDict(lang);
  return { title: t.projects.title, description: t.projects.intro };
}

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);

  return (
    <>
      <PageHeader lang={lang} title={t.projects.title} intro={t.projects.intro} crumbs={[{ href: `/${lang}`, label: t.nav.home }]} />
      <section className="border-b border-line bg-surface">
        <div className="container-x py-10">
          <ClientLogos />
        </div>
      </section>
      <div className="container-x section">
        <ProjectGrid lang={lang} />
        <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-surface p-8 md:flex-row md:items-center">
          <p className="max-w-2xl text-lg text-muted-foreground">{t.projects.note}</p>
          <Link href={`/${lang}/quote?type=general`} className={buttonVariants({ size: "lg" })}>{t.projects.cta}</Link>
        </div>
      </div>
    </>
  );
}

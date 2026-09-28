import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getDict } from "@/lib/dict";
import { hasLocale } from "@/lib/site";
import { aboutStory, media } from "@/data/company";
import { EquipmentGrid, Leadership } from "@/components/CompanySections";
import { buttonVariants } from "@/components/ui/button";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDict(lang);
  return { title: t.about.title, description: t.about.lead };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);
  const story = lang === "ar" ? aboutStory.ar : aboutStory.en;

  return (
    <>
      {/* Banner with the Nour factory photo */}
      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <Image src={media.factoryHero} alt={t.brand.name} fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/20 rtl:bg-gradient-to-l" aria-hidden />
        <div className="container-x py-20 md:py-28">
          <nav aria-label="Breadcrumb" className="text-[0.9375rem] text-slate-300">
            <Link href={`/${lang}`} className="hover:text-white">{t.nav.home}</Link> <span aria-hidden>/</span> <span className="text-white">{t.about.title}</span>
          </nav>
          <h1 className="t-h1 mt-4 max-w-3xl !text-white">{t.about.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-200 md:text-xl">{t.about.lead}</p>
        </div>
      </section>

      {/* Story */}
      <section className="container-x section grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div>
          <p className="eyebrow">{t.about.overviewTitle}</p>
          <h2 className="t-h2 mt-3">{t.about.storyTitle}</h2>
          <dl className="mt-10 grid grid-cols-2 gap-6">
            {t.home.trust.slice(0, 2).map((s) => (
              <div key={s.label} className="flex flex-col-reverse rounded-2xl border border-line p-6">
                <dt className="mt-1 text-muted-foreground">{s.label}</dt>
                <dd className="text-4xl font-bold text-navy-900">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="space-y-5">
          {story.map((para) => (
            <p key={para.slice(0, 24)} className="t-lead">{para}</p>
          ))}
        </div>
      </section>

      {/* Leadership + vision */}
      <section className="bg-surface">
        <div className="container-x section">
          <p className="eyebrow">{t.nav.about}</p>
          <h2 className="t-h2 mt-3">{t.about.leadershipTitle}</h2>
          <div className="mt-12">
            <Leadership lang={lang} />
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="container-x section">
        <p className="eyebrow">{t.home.equipmentEyebrow}</p>
        <h2 className="t-h2 mt-3">{t.about.equipmentTitle}</h2>
        <p className="t-lead mt-4 max-w-3xl">{t.about.factoryText}</p>
        <div className="mt-12">
          <EquipmentGrid lang={lang} />
        </div>
      </section>

      {/* Certificates (pending) */}
      <section className="container-x pb-20 lg:pb-28">
        <div className="flex flex-col gap-6 rounded-2xl border border-dashed border-line p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-5">
            <ShieldCheck className="size-10 shrink-0 text-brand-600" aria-hidden />
            <div>
              <h2 className="text-2xl font-bold">{t.about.certTitle}</h2>
              <p className="mt-2 text-lg text-muted-foreground">{t.about.certText}</p>
              <span className="mt-3 inline-block rounded-full bg-amber-100 px-3 py-0.5 text-sm font-semibold text-amber-800">{t.about.pending}</span>
            </div>
          </div>
          <Link href={`/${lang}/quote`} className={buttonVariants({ size: "lg" })}>{t.nav.quote}</Link>
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { equipment, leadership, projects, sectors, vision } from "@/data/company";
import { getDict } from "@/lib/dict";
import { sectorIcons } from "@/lib/industries";
import type { Locale } from "@/lib/site";

const pick = <T,>(lang: Locale, ar: T, en: T) => (lang === "ar" ? ar : en);

/** Sector cards with photos (from Nour's company profile). */
export function SectorGrid({ lang, withText = false }: { lang: Locale; withText?: boolean }) {
  const t = getDict(lang);
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {sectors.map((s) => {
        const Icon = sectorIcons[s.key];
        return (
          <li key={s.key} id={s.key} className="scroll-mt-40">
            <article className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={s.image} alt={pick(lang, s.ar, s.en)} fill sizes="(min-width:1024px) 320px, (min-width:640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent" aria-hidden />
                {Icon && (
                  <span className="absolute bottom-4 start-4 grid size-11 place-items-center rounded-xl bg-white/95 text-brand-600 shadow">
                    <Icon className="size-5" aria-hidden />
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold">{pick(lang, s.ar, s.en)}</h3>
                {withText && <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-muted-foreground">{pick(lang, s.descAr, s.descEn)}</p>}
                {withText && (
                  <Link href={`/${lang}/quote?type=general`} className="mt-4 text-[0.9375rem] font-semibold text-brand-600 hover:underline">
                    {t.industries.cta}
                  </Link>
                )}
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}

/** Project reference cards (photo + developer logo). */
export function ProjectGrid({ lang, limit }: { lang: Locale; limit?: number }) {
  const list = limit ? projects.slice(0, limit) : projects;
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((p) => (
        <li key={p.key}>
          <article className="card-hover group h-full overflow-hidden rounded-2xl border border-line bg-white">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={p.image} alt={pick(lang, p.nameAr, p.nameEn)} fill sizes="(min-width:1024px) 440px, (min-width:640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.05]" />
              {p.logo && (
                <span className="absolute top-4 start-4 grid h-14 w-24 place-items-center rounded-xl bg-white/95 p-2 shadow">
                  <Image src={p.logo} alt={p.brand} width={88} height={44} unoptimized={p.logo.endsWith(".svg")} className="max-h-10 w-auto object-contain" />
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold leading-snug">{pick(lang, p.nameAr, p.nameEn)}</h3>
              <p className="mt-1.5 text-[0.9375rem] text-muted-foreground">{pick(lang, p.subAr, p.subEn)}</p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

/** Logo strip of developers / authorities Nour has supplied. */
export function ClientLogos() {
  const withLogo = projects.filter((p) => p.logo);
  return (
    <ul className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-10">
      {withLogo.map((p) => (
        <li key={p.key} className="grid h-20 place-items-center rounded-xl border border-line bg-white p-3" title={p.brand}>
          <Image src={p.logo!} alt={p.brand} width={110} height={56} unoptimized={p.logo!.endsWith(".svg")} className="max-h-12 w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0" />
        </li>
      ))}
    </ul>
  );
}

/** Production equipment with photos. */
export function EquipmentGrid({ lang }: { lang: Locale }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {equipment.map((e) => (
        <li key={e.key}>
          <article className="card-hover h-full overflow-hidden rounded-2xl border border-line bg-white">
            <div className="relative aspect-[4/3] overflow-hidden bg-surface">
              <Image src={e.image} alt={pick(lang, e.nameAr, e.nameEn)} fill sizes="(min-width:1024px) 260px, (min-width:640px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold">{pick(lang, e.nameAr, e.nameEn)}</h3>
              {lang === "ar" && <p className="text-sm font-medium text-brand-600" dir="ltr" style={{ textAlign: "start" }}>{e.nameEn}</p>}
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">{pick(lang, e.descAr, e.descEn)}</p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

/** Leadership portraits + bios and the company vision. */
export function Leadership({ lang }: { lang: Locale }) {
  const t = getDict(lang);
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {leadership.map((l) => (
        <article key={l.key} className="rounded-2xl border border-line bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-surface">
              <Image src={l.image} alt={pick(lang, l.nameAr, l.nameEn)} fill sizes="96px" className="object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{pick(lang, l.nameAr, l.nameEn)}</h3>
              <p className="mt-1 inline-block rounded-full bg-brand-50 px-3 py-0.5 text-sm font-medium text-brand-700">{pick(lang, l.roleAr, l.roleEn)}</p>
            </div>
          </div>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">{pick(lang, l.bioAr, l.bioEn)}</p>
        </article>
      ))}
      <article className="grid-bg relative overflow-hidden rounded-2xl bg-navy-900 p-7 text-white">
        <p className="eyebrow !text-brand-100">{t.about.visionTitle}</p>
        <p className="mt-4 text-lg leading-relaxed text-slate-200">{pick(lang, vision.ar, vision.en)}</p>
      </article>
    </div>
  );
}

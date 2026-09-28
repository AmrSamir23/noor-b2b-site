import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/lib/site";

type Crumb = { href: string; label: string };

function Crumbs({ lang, crumbs, current, light }: { lang: Locale; crumbs: Crumb[]; current: string; light?: boolean }) {
  const Sep = lang === "ar" ? ChevronLeft : ChevronRight;
  return (
    <nav aria-label="Breadcrumb" className={light ? "text-slate-300" : "text-muted-foreground"}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[0.9375rem]">
        {crumbs.map((c) => (
          <li key={c.href} className="flex items-center gap-1.5">
            <Link href={c.href} className={light ? "hover:text-white" : "hover:text-brand-600"}>
              {c.label}
            </Link>
            <Sep className="size-4 opacity-60" aria-hidden />
          </li>
        ))}
        <li aria-current="page" className={light ? "text-white" : "font-medium text-navy-900"}>
          {current}
        </li>
      </ol>
    </nav>
  );
}

/** Large navy band with title — for section landing pages. */
export default function PageHeader({ lang, title, intro, crumbs = [] }: { lang: Locale; title: string; intro?: string; crumbs?: Crumb[] }) {
  return (
    <section className="grid-bg relative overflow-hidden bg-navy-900 text-white">
      <div className="absolute inset-y-0 end-0 w-1/3 bg-gradient-to-l from-brand-600/20 to-transparent rtl:bg-gradient-to-r" aria-hidden />
      <div className="container-x relative py-14 md:py-20">
        {crumbs.length > 0 && <Crumbs lang={lang} crumbs={crumbs} current={title} light />}
        <h1 className="t-h1 mt-4 !text-white">{title}</h1>
        {intro && <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">{intro}</p>}
      </div>
    </section>
  );
}

/** Slim breadcrumb bar — for detail pages where the title lives in the content. */
export function BreadcrumbBar({ lang, crumbs, current }: { lang: Locale; crumbs: Crumb[]; current: string }) {
  return (
    <div className="border-b border-line bg-surface">
      <div className="container-x py-4">
        <Crumbs lang={lang} crumbs={crumbs} current={current} />
      </div>
    </div>
  );
}

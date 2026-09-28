import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, FileSpreadsheet, Mail, MapPin, Phone, Ruler } from "lucide-react";
import { getDict } from "@/lib/dict";
import { categories, categoryDesc, categoryName, featuredProducts, productsIn } from "@/lib/products";
import { contact, hasLocale, whatsappLink } from "@/lib/site";
import { media } from "@/data/company";
import ProductCard from "@/components/ProductCard";
import { ClientLogos, EquipmentGrid, ProjectGrid, SectorGrid } from "@/components/CompanySections";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="t-h2 mt-3">{title}</h2>
      {text && <p className="t-lead mt-4">{text}</p>}
    </div>
  );
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <>
      {/* ---------- Hero: Nour factory photo ---------- */}
      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <Image src={media.factoryHero} alt={t.brand.name} fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/30 rtl:bg-gradient-to-l" aria-hidden />
        <div className="container-x py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[0.9375rem] text-slate-100 backdrop-blur">
              <span className="size-2 rounded-full bg-accent-500" aria-hidden /> {t.home.heroEyebrow}
            </p>
            <h1 className="t-display mt-6 !text-white">{t.home.heroTitle}</h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-200 md:text-xl">{t.home.heroText}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={`/${lang}/products`} className={buttonVariants({ size: "lg", className: "bg-white text-navy-900 hover:bg-slate-100" })}>
                {t.home.ctaProducts} <Arrow aria-hidden />
              </Link>
              <Link href={`/${lang}/quote?type=boq`} className={buttonVariants({ variant: "accent", size: "lg" })}>
                <FileSpreadsheet aria-hidden /> {t.home.ctaBoq}
              </Link>
              <Link href={`/${lang}/quote?type=custom`} className={buttonVariants({ variant: "outline-light", size: "lg", className: "backdrop-blur" })}>
                {t.home.ctaCustom}
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 bg-navy-950/70 backdrop-blur">
          <dl className="container-x grid grid-cols-2 gap-y-8 py-9 md:grid-cols-4">
            {t.home.trust.map((s) => (
              <div key={s.label} className="flex flex-col-reverse border-white/10 px-2 md:border-s md:px-8 md:first:border-s-0 md:first:ps-0">
                <dt className="mt-2 text-base text-slate-300">{s.label}</dt>
                <dd className="text-4xl font-bold text-white md:text-5xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Client logos ---------- */}
      <section className="border-b border-line bg-surface">
        <div className="container-x py-10">
          <p className="mb-6 text-center text-base font-medium text-muted-foreground">{t.home.projectsText}</p>
          <ClientLogos />
        </div>
      </section>

      {/* ---------- Categories ---------- */}
      <section className="container-x section">
        <SectionHead eyebrow={t.home.categoriesEyebrow} title={t.home.categoriesTitle} text={t.home.categoriesText} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.slug} href={`/${lang}/products?category=${c.slug}`} className="card-hover group overflow-hidden rounded-2xl border border-line bg-white">
              <div className="relative aspect-[4/3] overflow-hidden border-b border-line bg-white">
                {c.image && <Image src={c.image} alt="" fill sizes="(min-width:1024px) 320px, 50vw" className="object-contain p-[7%] transition duration-500 group-hover:scale-[1.04]" />}
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold group-hover:text-brand-600">{categoryName(c, lang)}</h3>
                <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-muted-foreground">{categoryDesc(c, lang)}</p>
                <p className="mt-4 flex items-center justify-between text-[0.9375rem] font-semibold text-brand-600">
                  <span>{productsIn(c.slug).length} {t.home.productsCount}</span>
                  <Arrow className="size-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
                </p>
              </div>
            </Link>
          ))}
          <Link href={`/${lang}/quote?type=custom`} className="card-hover flex flex-col justify-between gap-8 rounded-2xl bg-brand-600 p-7 text-white hover:bg-brand-700">
            <Ruler className="size-12 opacity-80" aria-hidden />
            <div>
              <h3 className="text-xl font-semibold !text-white">{t.home.ctaCustom}</h3>
              <p className="mt-2 text-base leading-relaxed text-white/80">{t.home.customTitle}</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ---------- Custom manufacturing + equipment ---------- */}
      <section className="bg-surface">
        <div className="container-x section">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow={t.home.customEyebrow} title={t.home.customTitle} text={t.home.customText} />
            <Link href={`/${lang}/quote?type=custom`} className={buttonVariants({ size: "lg" })}>{t.home.ctaCustom}</Link>
          </div>
          <div className="mt-12">
            <EquipmentGrid lang={lang} />
          </div>
        </div>
      </section>

      {/* ---------- Projects ---------- */}
      <section className="container-x section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow={t.home.projectsEyebrow} title={t.home.projectsTitle} text={t.home.projectsText} />
          <Link href={`/${lang}/projects`} className={buttonVariants({ variant: "outline", size: "lg" })}>
            {t.home.viewProjects} <Arrow aria-hidden />
          </Link>
        </div>
        <div className="mt-12">
          <ProjectGrid lang={lang} limit={6} />
        </div>
      </section>

      {/* ---------- Sectors ---------- */}
      <section className="bg-surface">
        <div className="container-x section">
          <SectionHead eyebrow={t.home.industriesEyebrow} title={t.home.industriesTitle} />
          <div className="mt-12">
            <SectorGrid lang={lang} />
          </div>
        </div>
      </section>

      {/* ---------- Featured ---------- */}
      <section className="container-x section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow={t.home.featuredEyebrow} title={t.home.featuredTitle} />
          <Link href={`/${lang}/products`} className={buttonVariants({ variant: "outline", size: "lg" })}>
            {t.home.viewAll} <Arrow aria-hidden />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts().map((p) => (
            <ProductCard key={p.slug} product={p} lang={lang} />
          ))}
        </div>
      </section>

      {/* ---------- Why Nour ---------- */}
      <section className="bg-surface">
        <div className="container-x section">
          <SectionHead eyebrow={t.home.whyEyebrow} title={t.home.whyTitle} />
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.home.why.map((w, n) => (
              <div key={w.title} className="border-s-2 border-brand-600 ps-6">
                <span className="font-mono text-base font-semibold text-accent-500">0{n + 1}</span>
                <h3 className="mt-2 text-xl font-semibold">{w.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- BOQ CTA ---------- */}
      <section className="grid-bg relative overflow-hidden bg-navy-900 text-white">
        <div className="absolute -bottom-40 start-0 size-[520px] rounded-full bg-accent-500/15 blur-3xl" aria-hidden />
        <div className="container-x relative flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:justify-between lg:py-20">
          <div className="max-w-2xl">
            <h2 className="t-h2 !text-white">{t.home.boqTitle}</h2>
            <p className="mt-4 text-lg text-slate-300">{t.home.boqText}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${lang}/quote?type=boq`} className={buttonVariants({ variant: "accent", size: "lg" })}>
              <FileSpreadsheet aria-hidden /> {t.home.ctaBoq}
            </Link>
            <Link href={`/${lang}/quote`} className={buttonVariants({ variant: "outline-light", size: "lg" })}>{t.nav.quote}</Link>
          </div>
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section className="container-x section grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHead eyebrow={t.nav.contact} title={t.contact.title} text={t.contact.intro} />
          <ul className="mt-10 space-y-5 text-lg">
            <li className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600"><Phone className="size-5" aria-hidden /></span>
              <a href={contact.phoneHref} dir="ltr" className="font-semibold hover:text-brand-600">{contact.phoneDisplay}</a>
            </li>
            <li className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><Mail className="size-5" aria-hidden /></span>
              <a href={`mailto:${contact.email}`} className="break-all font-semibold hover:text-brand-600">{contact.email}</a>
            </li>
            <li className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><MapPin className="size-5" aria-hidden /></span>
              <span>{lang === "ar" ? contact.addressAr : contact.addressEn}</span>
            </li>
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={whatsappLink(t.wa.hello)} target="_blank" rel="noopener" className={buttonVariants({ variant: "whatsapp", size: "lg" })}>
              <WhatsAppIcon className="size-5" /> {t.common.whatsapp}
            </a>
            <Link href={`/${lang}/contact`} className={buttonVariants({ variant: "outline", size: "lg" })}>{t.nav.contact}</Link>
          </div>
        </div>
        <div className="min-h-96 overflow-hidden rounded-3xl border border-line">
          <iframe title={t.contact.address} src={contact.mapEmbed} className="size-full min-h-96" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, Ruler, ShieldCheck, Factory } from "lucide-react";
import { getDict } from "@/lib/dict";
import { categoryName, formatDims, getCategory, getProduct, productName, products, relatedProducts } from "@/lib/products";
import { hasLocale, locales, whatsappLink } from "@/lib/site";
import { BreadcrumbBar } from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import AddToQuoteButton from "@/components/AddToQuoteButton";
import ShareButton from "@/components/ShareButton";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";

export function generateStaticParams() {
  return locales.flatMap((lang) => products.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/products/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = getProduct(slug);
  if (!hasLocale(lang) || !p) return {};
  const t = getDict(lang);
  const name = lang === "ar" ? p.nameAr : p.nameEn; // plain text: no bidi isolates in <title>
  return {
    title: `${name} (${p.code})`,
    description: `${name}: ${t.products.dimensions} ${formatDims(p.dimensions)} ${t.products.dimsUnit}.`,
    openGraph: { images: p.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: PageProps<"/[lang]/products/[slug]">) {
  const { lang, slug } = await params;
  const p = getProduct(slug);
  if (!hasLocale(lang) || !p) notFound();
  const t = getDict(lang);
  const cat = getCategory(p.category)!;
  const name = productName(p, lang);
  const unit = t.products.dimsUnit;

  const dims = [
    { label: t.products.h, value: p.dimensions.h },
    { label: t.products.w, value: p.dimensions.w },
    { label: t.products.d, value: p.dimensions.d },
  ];
  const rows: [string, React.ReactNode][] = [
    [t.products.code, <span key="c" dir="ltr" className="font-mono">{p.code}</span>],
    [t.products.category, categoryName(cat, lang)],
    [t.products.dimensions, <span key="dm"><span dir="ltr">{formatDims(p.dimensions)}</span> {unit}</span>],
    [t.products.material, p.material === "metal" ? t.products.metal : <span key="m" className="text-muted-foreground">{t.products.toConfirm}</span>],
    [t.products.customizable, t.products.customizableYes],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: lang === "ar" ? p.nameAr : p.nameEn,
    sku: p.code,
    image: p.images,
    category: categoryName(cat, lang),
    brand: { "@type": "Brand", name: "Nour Modern Lighting" },
    height: { "@type": "QuantitativeValue", value: p.dimensions.h, unitCode: "MMT" },
    width: { "@type": "QuantitativeValue", value: p.dimensions.w, unitCode: "MMT" },
    depth: { "@type": "QuantitativeValue", value: p.dimensions.d, unitCode: "MMT" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <BreadcrumbBar
        lang={lang}
        current={name}
        crumbs={[
          { href: `/${lang}`, label: t.nav.home },
          { href: `/${lang}/products`, label: t.nav.products },
          { href: `/${lang}/products?category=${cat.slug}`, label: categoryName(cat, lang) },
        ]}
      />

      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-14">
        <ProductGallery images={p.images} drawing={p.drawing} alt={name} />

        <div className="lg:py-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="h-7 px-3 text-sm text-brand-700">{categoryName(cat, lang)}</Badge>
            <Badge variant="outline" className="h-7 px-3 font-mono text-sm" dir="ltr">{p.code}</Badge>
          </div>
          <h1 className="t-h1 mt-4">{name}</h1>
          <p className="t-lead mt-5">{t.products.overviewText(name, categoryName(cat, lang))}</p>

          {/* Key dimensions */}
          <dl className="mt-8 grid grid-cols-3 overflow-hidden rounded-2xl border border-line">
            {dims.map((d) => (
              <div key={d.label} className="border-line p-4 text-center not-last:border-e sm:p-5">
                <dt className="text-sm text-muted-foreground">{d.label}</dt>
                <dd className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">
                  {d.value}
                  <span className="ms-1 text-base font-medium text-muted-foreground">{unit}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <AddToQuoteButton slug={p.slug} name={name} className="min-w-56 flex-1 sm:flex-none" />
            <Link href={`/${lang}/quote?type=custom&product=${p.slug}`} className={buttonVariants({ variant: "outline", size: "lg", className: "flex-1 sm:flex-none" })}>
              <Ruler aria-hidden /> {t.products.requestCustom}
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-base">
            <a href={whatsappLink(t.wa.tech(name, p.code))} target="_blank" rel="noopener" className="inline-flex items-center gap-2 font-semibold text-brand-600 hover:underline">
              <MessageCircle className="size-5" aria-hidden /> {t.products.askTech}
            </a>
            <ShareButton />
          </div>

          <ul className="mt-8 grid gap-3 border-t border-line pt-6 text-[0.9375rem] sm:grid-cols-2">
            <li className="flex items-center gap-3"><Factory className="size-5 shrink-0 text-brand-600" aria-hidden /> {t.home.why[0].title}</li>
            <li className="flex items-center gap-3"><ShieldCheck className="size-5 shrink-0 text-brand-600" aria-hidden /> {t.home.why[1].title}</li>
          </ul>
        </div>
      </div>

      <section className="container-x pb-16 lg:pb-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className="t-h2">{t.products.dimensions}</h2>
            <p className="mt-3 text-muted-foreground">{t.products.specNote}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line">
            <Table>
              <TableBody>
                {rows.map(([k, v]) => (
                  <TableRow key={k} className="even:bg-surface hover:bg-transparent">
                    <TableHead scope="row" className="w-2/5 font-medium text-muted-foreground">{k}</TableHead>
                    <TableCell className="font-semibold text-navy-900">{v}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="container-x section">
          <h2 className="t-h2">{t.products.related}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts(p).map((r) => (
              <ProductCard key={r.slug} product={r} lang={lang} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

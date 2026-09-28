import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon } from "./icons";
import { extraContact } from "@/data/company";
import { getDict } from "@/lib/dict";
import { categories, categoryName } from "@/lib/products";
import { contact, whatsappLink } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import type { Locale } from "@/lib/site";

export default function Footer({ lang }: { lang: Locale }) {
  const t = getDict(lang);

  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:py-20">
        <div>
          <div className="inline-block rounded-lg bg-white p-2">
            <Image src="/logo.png" alt={t.brand.name} width={120} height={67} className="h-14 w-auto" />
          </div>
          <p className="mt-5 max-w-sm leading-relaxed">{t.about.lead}</p>
        </div>
        <div>
          <h2 className="mb-5 text-lg font-semibold text-white">{t.footer.quick}</h2>
          <ul className="space-y-3">
            <li><Link className="hover:text-white" href={`/${lang}/products`}>{t.nav.products}</Link></li>
            <li><Link className="hover:text-white" href={`/${lang}/quote?type=custom`}>{t.nav.custom}</Link></li>
            <li><Link className="hover:text-white" href={`/${lang}/quote?type=boq`}>{t.home.ctaBoq}</Link></li>
            <li><Link className="hover:text-white" href={`/${lang}/projects`}>{t.nav.projects}</Link></li>
            <li><Link className="hover:text-white" href={`/${lang}/industries`}>{t.nav.industries}</Link></li>
            <li><Link className="hover:text-white" href={`/${lang}/about`}>{t.nav.about}</Link></li>
            <li><Link className="hover:text-white" href={`/${lang}/contact`}>{t.nav.contact}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-5 text-lg font-semibold text-white">{t.footer.productsTitle}</h2>
          <ul className="space-y-3">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link className="hover:text-white" href={`/${lang}/products?category=${c.slug}`}>
                  {categoryName(c, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-5 text-lg font-semibold text-white">{t.footer.contactTitle}</h2>
          <ul className="space-y-4">
            <li className="flex gap-2">
              <Phone className="size-4 shrink-0 translate-y-0.5" aria-hidden />
              <a className="hover:text-white" href={contact.phoneHref} dir="ltr">{contact.phoneDisplay}</a>
              <span aria-hidden>·</span>
              <a className="hover:text-white" href={extraContact.phone2Href} dir="ltr">{extraContact.phone2Display}</a>
            </li>
            <li className="flex gap-2">
              <Mail className="size-4 shrink-0 translate-y-0.5" aria-hidden />
              <a className="break-all hover:text-white" href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li className="flex gap-2">
              <MapPin className="size-4 shrink-0 translate-y-0.5" aria-hidden />
              <span>{lang === "ar" ? contact.addressAr : contact.addressEn}</span>
            </li>
            <li>
              <a className={buttonVariants({ variant: "outline-light", size: "lg", className: "mt-2" })} href={whatsappLink(t.wa.hello)} target="_blank" rel="noopener">
                {t.common.whatsapp}
              </a>
              <a className={buttonVariants({ variant: "outline-light", size: "lg", className: "ms-2 mt-2" })} href={extraContact.facebook} target="_blank" rel="noopener">
                <FacebookIcon className="size-4" /> {t.contact.facebook}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-wrap items-center justify-between gap-2 py-6 text-sm text-slate-400">
          <span>© {new Date().getFullYear()} {t.brand.name}. {t.footer.rights}</span>
          <span className="rounded-full border border-white/15 px-3 py-1">{t.common.demoBadge}</span>
        </div>
      </div>
    </footer>
  );
}

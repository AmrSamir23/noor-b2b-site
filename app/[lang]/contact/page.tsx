import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Mail, MapPin, Phone, PhoneCall } from "lucide-react";
import { extraContact } from "@/data/company";
import { getDict } from "@/lib/dict";
import { contact, hasLocale, whatsappLink } from "@/lib/site";
import PageHeader from "@/components/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { FacebookIcon, WhatsAppIcon } from "@/components/icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDict(lang);
  return { title: t.contact.title, description: t.contact.intro };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);

  const cards = [
    { icon: Phone, label: t.contact.phone, value: <a href={contact.phoneHref} dir="ltr" className="hover:text-brand-600">{contact.phoneDisplay}</a> },
    { icon: WhatsAppIcon, label: t.contact.whatsapp, value: <a href={whatsappLink(t.wa.hello)} target="_blank" rel="noopener" dir="ltr" className="hover:text-brand-600">{contact.phoneDisplay}</a> },
    { icon: Mail, label: t.contact.email, value: <a href={`mailto:${contact.email}`} className="break-all hover:text-brand-600">{contact.email}</a> },
    { icon: PhoneCall, label: t.contact.phone2, value: <a href={extraContact.phone2Href} dir="ltr" className="hover:text-brand-600">{extraContact.phone2Display}</a> },
    { icon: FacebookIcon, label: t.contact.facebook, value: <a href={extraContact.facebook} target="_blank" rel="noopener" className="hover:text-brand-600">{t.contact.facebookPage}</a> },
    { icon: Clock, label: t.contact.hours, value: <span className="text-muted-foreground">{t.contact.hoursValue}</span> },
  ];

  return (
    <>
      <PageHeader lang={lang} title={t.contact.title} intro={t.contact.intro} crumbs={[{ href: `/${lang}`, label: t.nav.home }]} />
      <div className="container-x section">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border border-line p-6">
              <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon className="size-6" aria-hidden /></span>
              <p className="mt-4 text-muted-foreground">{label}</p>
              <p className="mt-1 text-lg font-semibold text-navy-900">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="rounded-2xl border border-line p-7">
            <MapPin className="size-6 text-brand-600" aria-hidden />
            <h2 className="mt-4 text-xl font-semibold">{t.contact.address}</h2>
            <p className="mt-2 text-lg text-muted-foreground">{lang === "ar" ? contact.addressAr : contact.addressEn}</p>
            <a href={extraContact.mapsShort} target="_blank" rel="noopener" className={buttonVariants({ variant: "outline", size: "lg", className: "mt-6" })}>{t.contact.openMap}</a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line">
            <iframe title={t.contact.address} src={contact.mapEmbed} className="h-[28rem] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </>
  );
}

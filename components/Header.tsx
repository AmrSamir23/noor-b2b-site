"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ClipboardList, Globe, Mail, Menu, Phone } from "lucide-react";
import { useDict, useLocale } from "@/lib/i18n";
import { useBasket } from "@/lib/basket";
import { contact } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const t = useDict();
  const lang = useLocale();
  const pathname = usePathname();
  const { count } = useBasket();
  const [open, setOpen] = useState(false);

  const other = lang === "ar" ? "en" : "ar";
  const switchHref = pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${other}`);

  const links = [
    { href: `/${lang}`, label: t.nav.home },
    { href: `/${lang}/products`, label: t.nav.products },
    { href: `/${lang}/quote?type=custom`, label: t.nav.custom },
    { href: `/${lang}/projects`, label: t.nav.projects },
    { href: `/${lang}/industries`, label: t.nav.industries },
    { href: `/${lang}/about`, label: t.nav.about },
    { href: `/${lang}/contact`, label: t.nav.contact },
  ];
  const isActive = (href: string) => {
    const path = href.split("?")[0];
    return path === `/${lang}` ? pathname === path : pathname.startsWith(path) && !href.includes("?");
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Utility bar */}
      <div className="hidden bg-navy-950 text-sm text-slate-300 lg:block">
        <div className="container-x flex h-10 items-center justify-between">
          <span>{t.home.heroEyebrow}</span>
          <div className="flex items-center gap-6">
            <a href={contact.phoneHref} className="flex items-center gap-2 hover:text-white">
              <Phone className="size-4" aria-hidden /> <span dir="ltr">{contact.phoneDisplay}</span>
            </a>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-white">
              <Mail className="size-4" aria-hidden /> {contact.email}
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-line bg-white/95 backdrop-blur">
        <div className="container-x flex h-18 items-center gap-6 lg:h-22">
          <Link href={`/${lang}`} className="flex shrink-0 items-center gap-3" aria-label={t.brand.name}>
            <Image src="/logo.png" alt="" width={120} height={67} priority className="h-11 w-auto lg:h-14" />
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-lg font-bold text-navy-900">{t.brand.name}</span>
              <span className="text-sm text-muted-foreground">{t.brand.tagline}</span>
            </span>
          </Link>

          <nav className="ms-auto hidden h-full items-stretch xl:flex" aria-label="Main">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className="relative flex items-center whitespace-nowrap px-3.5 text-base font-medium text-navy-800 transition-colors hover:text-brand-600 after:absolute after:inset-x-3.5 after:bottom-0 after:h-0.5 after:scale-x-0 after:bg-brand-600 after:transition-transform aria-[current=page]:text-brand-600 aria-[current=page]:after:scale-x-100"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-1.5 xl:ms-2">
            <Link href={switchHref} hrefLang={other} className={buttonVariants({ variant: "ghost", className: "text-base text-navy-800" })}>
              <Globe className="size-4" aria-hidden />
              {t.nav.switchLang}
            </Link>
            <Link href={`/${lang}/quote`} className={buttonVariants({ variant: "ghost", size: "icon", className: "relative text-navy-800" })} aria-label={`${t.nav.basket} (${count})`}>
              <ClipboardList className="size-6" aria-hidden />
              {count > 0 && (
                <span className="absolute top-0.5 end-0.5 grid size-5 place-items-center rounded-full bg-accent-500 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            <Link href={`/${lang}/quote`} className={buttonVariants({ size: "lg", className: "ms-2 hidden md:inline-flex" })}>
              {t.nav.quote}
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "text-navy-800 xl:hidden" })} aria-label={t.nav.menu}>
                <Menu className="size-6" aria-hidden />
              </SheetTrigger>
              <SheetContent side={lang === "ar" ? "left" : "right"} className="w-80 gap-0 p-0">
                <SheetHeader className="border-b border-line p-5">
                  <SheetTitle className="text-lg">{t.nav.menu}</SheetTitle>
                </SheetHeader>
                <nav aria-label="Mobile" className="flex flex-1 flex-col overflow-y-auto p-3">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(l.href) ? "page" : undefined}
                      className="rounded-lg px-4 py-3.5 text-lg font-medium text-navy-800 hover:bg-muted aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-600"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
                <div className="space-y-3 border-t border-line p-5">
                  <Link href={`/${lang}/quote`} onClick={() => setOpen(false)} className={buttonVariants({ size: "lg", className: "w-full" })}>
                    {t.nav.quote}
                  </Link>
                  <a href={contact.phoneHref} className={buttonVariants({ variant: "outline", size: "lg", className: "w-full" })}>
                    <Phone className="size-4" aria-hidden /> <span dir="ltr">{contact.phoneDisplay}</span>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

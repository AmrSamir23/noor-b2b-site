"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDict, useLocale } from "@/lib/i18n";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";
import { buttonVariants } from "@/components/ui/button";

export default function FloatingActions() {
  const t = useDict();
  const lang = useLocale();
  const onQuote = usePathname().endsWith("/quote");

  return (
    <>
      {/* Desktop: single WhatsApp bubble */}
      <a
        href={whatsappLink(t.wa.hello)}
        target="_blank"
        rel="noopener"
        aria-label={t.common.whatsapp}
        className="no-print fixed bottom-6 end-6 z-30 hidden size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 md:grid"
      >
        <WhatsAppIcon className="size-7" />
      </a>
      {/* Mobile: bottom action bar */}
      <div className="no-print fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-white/95 p-2 backdrop-blur md:hidden">
        <a href={whatsappLink(t.wa.hello)} target="_blank" rel="noopener" className={buttonVariants({ variant: "whatsapp", size: "lg", className: "flex-1" })}>
          <WhatsAppIcon className="size-5" /> {t.common.whatsapp}
        </a>
        {!onQuote && (
          <Link href={`/${lang}/quote`} className={buttonVariants({ size: "lg", className: "flex-1" })}>
            {t.nav.quote}
          </Link>
        )}
      </div>
      <div className="h-20 md:hidden" aria-hidden />
    </>
  );
}

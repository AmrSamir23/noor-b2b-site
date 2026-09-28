"use client";

import Image from "next/image";
import { useState } from "react";
import { Ruler } from "lucide-react";
import { useDict } from "@/lib/i18n";
import ProductImage from "./ProductImage";

export default function ProductGallery({ images, drawing, alt }: { images: string[]; drawing: string | null; alt: string }) {
  const t = useDict();
  const slides = [...images.map((src) => ({ src, kind: "photo" as const })), ...(drawing ? [{ src: drawing, kind: "drawing" as const }] : [])];
  const [active, setActive] = useState(0);
  const current = slides[active];

  return (
    <div className="lg:sticky lg:top-36 lg:self-start">
      <div className="relative aspect-[4/3.2] overflow-hidden rounded-3xl border border-line bg-white">
        {current?.kind === "drawing" ? (
          <Image src={current.src} alt={`${alt} — ${t.products.drawing}`} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-contain p-[5%]" />
        ) : (
          <ProductImage src={current?.src} alt={alt} sizes="(min-width:1024px) 50vw, 100vw" priority />
        )}
        {current?.kind === "drawing" && (
          <span className="absolute top-4 start-4 inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-3 py-1 text-sm font-medium text-white">
            <Ruler className="size-4" aria-hidden /> {t.products.drawing}
          </span>
        )}
      </div>
      {slides.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {slides.map((s, n) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setActive(n)}
              aria-pressed={n === active}
              aria-label={s.kind === "drawing" ? t.products.drawing : `${t.products.photo} ${n + 1}`}
              className="group relative size-24 overflow-hidden rounded-xl border-2 border-line bg-white transition-colors hover:border-brand-500/60 aria-pressed:border-brand-600"
            >
              <Image src={s.src} alt="" fill sizes="96px" className="object-contain p-2" />
              {s.kind === "drawing" && (
                <span className="absolute inset-x-0 bottom-0 bg-navy-900/85 py-0.5 text-center text-[11px] font-medium text-white">{t.products.drawing}</span>
              )}
            </button>
          ))}
        </div>
      )}
      {current?.kind === "drawing" && <p className="mt-3 text-sm text-muted-foreground">{t.products.drawingNote}</p>}
    </div>
  );
}

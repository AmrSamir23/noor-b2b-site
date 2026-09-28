import Link from "next/link";
import { ArrowLeft, ArrowRight, Ruler } from "lucide-react";
import { getDict } from "@/lib/dict";
import { formatDims, getCategory, categoryName, productName, type Product } from "@/lib/products";
import type { Locale } from "@/lib/site";
import { Badge } from "@/components/ui/badge";
import AddToQuoteButton from "./AddToQuoteButton";
import ProductImage from "./ProductImage";

export default function ProductCard({ product, lang }: { product: Product; lang: Locale }) {
  const t = getDict(lang);
  const cat = getCategory(product.category);
  const href = `/${lang}/products/${product.slug}`;
  const name = productName(product, lang);
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <article className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden border-b border-line bg-white" tabIndex={-1} aria-hidden>
        <ProductImage src={product.images[0]} alt="" sizes="(min-width:1280px) 420px, (min-width:640px) 50vw, 100vw" className="transition duration-500 group-hover:scale-[1.04]" />
        <Badge variant="secondary" className="absolute top-3 start-3 h-7 bg-white/95 px-2.5 font-mono text-xs text-navy-800 shadow-sm" dir="ltr">
          {product.code}
        </Badge>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="text-sm font-semibold text-brand-600">{cat ? categoryName(cat, lang) : ""}</span>
        <h3 className="text-lg font-semibold leading-snug">
          <Link href={href} className="hover:text-brand-600">
            {name}
          </Link>
        </h3>
        <p className="flex items-center gap-2 text-[0.9375rem] text-muted-foreground">
          <Ruler className="size-4 shrink-0 text-brand-600" aria-hidden />
          <span dir="ltr" className="font-medium text-ink">{formatDims(product.dimensions)}</span>
          <span>{t.products.dimsUnit}</span>
        </p>
        <div className="mt-auto flex items-center gap-3 border-t border-line pt-4">
          <AddToQuoteButton slug={product.slug} name={name} size="default" className="flex-1" />
          <Link href={href} className="inline-flex items-center gap-1 px-2 text-[0.9375rem] font-semibold text-brand-600 hover:underline">
            {t.products.details} <Arrow className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

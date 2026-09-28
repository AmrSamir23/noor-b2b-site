"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useDict, useLocale } from "@/lib/i18n";
import { categories, categoryName, products } from "@/lib/products";
import { matches } from "@/lib/search";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ProductCard from "./ProductCard";

type Sort = "default" | "size-asc" | "size-desc" | "name";

export default function ProductBrowser() {
  const t = useDict();
  const lang = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const category = params.get("category") ?? "";
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState<Sort>("default");
  const [minH, setMinH] = useState("");
  const [maxH, setMaxH] = useState("");
  const [drawer, setDrawer] = useState(false);

  const setCategory = (slug: string) => {
    const next = new URLSearchParams(params);
    if (slug) next.set("category", slug);
    else next.delete("category");
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const results = useMemo(() => {
    const lo = Number(minH) || 0;
    const hi = Number(maxH) || Infinity;
    const list = products.filter(
      (p) =>
        (!category || p.category === category) &&
        p.dimensions.h >= lo &&
        p.dimensions.h <= hi &&
        matches(
          [p.nameAr, p.nameEn, p.code, `${p.dimensions.h}x${p.dimensions.w}x${p.dimensions.d}`, `${p.dimensions.w}x${p.dimensions.h}`],
          query,
        ),
    );
    const vol = (p: (typeof list)[number]) => p.dimensions.h * p.dimensions.w * p.dimensions.d;
    if (sort === "size-asc") list.sort((a, b) => vol(a) - vol(b));
    if (sort === "size-desc") list.sort((a, b) => vol(b) - vol(a));
    if (sort === "name") list.sort((a, b) => (lang === "ar" ? a.nameAr : a.nameEn).localeCompare(lang === "ar" ? b.nameAr : b.nameEn, lang));
    return list;
  }, [category, query, minH, maxH, sort, lang]);

  const activeFilters = Boolean(category || query || minH || maxH);
  const clear = () => {
    setQuery("");
    setMinH("");
    setMaxH("");
    setCategory("");
  };

  const catButton = (slug: string, label: string, count: number) => (
    <li key={slug || "all"}>
      <button
        type="button"
        onClick={() => setCategory(slug)}
        aria-pressed={category === slug}
        className="flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-start text-base text-navy-800 transition-colors hover:bg-muted aria-pressed:bg-brand-600 aria-pressed:font-semibold aria-pressed:text-white"
      >
        <span>{label}</span>
        <span className="text-sm opacity-70">{count}</span>
      </button>
    </li>
  );

  const filters = (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground rtl:tracking-normal">{t.products.category}</legend>
        <ul className="space-y-1">
          {catButton("", t.products.all, products.length)}
          {categories.map((c) => catButton(c.slug, categoryName(c, lang), products.filter((p) => p.category === c.slug).length))}
        </ul>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground rtl:tracking-normal">{t.products.height}</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="minH" className="mb-1.5 text-sm text-muted-foreground">{t.products.min}</Label>
            <Input id="minH" inputMode="numeric" dir="ltr" placeholder="200" value={minH} onChange={(e) => setMinH(e.target.value.replace(/\D/g, ""))} />
          </div>
          <div>
            <Label htmlFor="maxH" className="mb-1.5 text-sm text-muted-foreground">{t.products.max}</Label>
            <Input id="maxH" inputMode="numeric" dir="ltr" placeholder="900" value={maxH} onChange={(e) => setMaxH(e.target.value.replace(/\D/g, ""))} />
          </div>
        </div>
      </fieldset>
      {activeFilters && (
        <Button type="button" variant="outline" size="lg" onClick={clear} className="w-full">
          <X aria-hidden /> {t.products.clear}
        </Button>
      )}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr] xl:gap-14">
      <aside className="hidden lg:block" aria-label={t.products.filters}>
        <div className="sticky top-36 rounded-2xl border border-line bg-white p-5">{filters}</div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-0 flex-1 basis-72">
            <span className="sr-only">{t.products.search}</span>
            <Search className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input type="search" className="h-12 ps-12 text-base" placeholder={t.products.search} value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger className="h-12! min-w-0 max-w-full sm:w-60" aria-label={t.products.sort}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{t.products.sortDefault}</SelectItem>
              <SelectItem value="size-asc">{t.products.sortSizeAsc}</SelectItem>
              <SelectItem value="size-desc">{t.products.sortSizeDesc}</SelectItem>
              <SelectItem value="name">{t.products.sortName}</SelectItem>
            </SelectContent>
          </Select>
          <Sheet open={drawer} onOpenChange={setDrawer}>
            <SheetTrigger className={buttonVariants({ variant: "outline", size: "lg", className: "lg:hidden" })}>
              <SlidersHorizontal aria-hidden /> {t.products.filters}
            </SheetTrigger>
            <SheetContent side={lang === "ar" ? "right" : "left"} className="w-[340px] gap-0 p-0">
              <SheetHeader className="border-b border-line p-5">
                <SheetTitle className="text-lg">{t.products.filters}</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-5">{filters}</div>
              <SheetFooter className="border-t border-line p-5">
                <Button size="lg" className="w-full" onClick={() => setDrawer(false)}>
                  {t.products.showResults} ({results.length})
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Category chips (mobile quick nav) */}
        <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 lg:hidden">
          {[{ slug: "", label: t.products.all }, ...categories.map((c) => ({ slug: c.slug, label: categoryName(c, lang) }))].map((c) => (
            <button key={c.slug || "all"} type="button" onClick={() => setCategory(c.slug)} aria-pressed={category === c.slug} className="shrink-0 rounded-full border border-line bg-white px-4 py-2 text-[0.9375rem] font-medium aria-pressed:border-brand-600 aria-pressed:bg-brand-600 aria-pressed:text-white">
              {c.label}
            </button>
          ))}
        </div>

        <p className="mt-6 text-base text-muted-foreground" role="status" aria-live="polite">
          <span className="font-semibold text-navy-900">{results.length}</span> {t.products.results}
        </p>

        {results.length ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => (
              <ProductCard key={p.slug} product={p} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-line p-12 text-center">
            <p className="text-lg font-semibold text-navy-900">{t.products.empty}</p>
            <p className="mt-2 text-muted-foreground">{t.products.emptyCta}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button variant="outline" size="lg" onClick={clear}>{t.products.clear}</Button>
              <Link href={`/${lang}/quote?type=custom`} className={buttonVariants({ size: "lg" })}>{t.products.requestCustom}</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

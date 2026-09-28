"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { CheckCircle2, FileText, Mail, Paperclip, Printer, Trash2, X } from "lucide-react";
import { useBasket } from "@/lib/basket";
import { useDict, useLocale } from "@/lib/i18n";
import { categories, categoryName, formatDims, getProduct, productName } from "@/lib/products";
import { buildSchema, fileProblem, isRequestType, makeReference, requestTypes, ALLOWED_EXT, type RequestType } from "@/lib/quote";
import { contact, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Native <select> styled to match shadcn Input (Radix Select cannot hold an empty "not sure" value).
const nativeSelect =
  "h-11 w-full rounded-lg border border-input bg-white px-3.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
const labelCls = "mb-2 block text-[0.9375rem] font-semibold text-navy-800";

type Values = Record<string, string>;
type Submitted = { ref: string; type: RequestType; text: string; lines: [string, string][]; items: string[]; files: string[] };

export default function QuoteForm() {
  const t = useDict();
  const lang = useLocale();
  const params = useSearchParams();
  const basket = useBasket();
  const q = t.quote;
  const f = q.f;

  const initialType: RequestType = isRequestType(params.get("type")) ? (params.get("type") as RequestType) : "products";
  const [type, setType] = useState<RequestType>(initialType);
  const baseProduct = getProduct(params.get("product") ?? "");
  const [values, setValues] = useState<Values>(() => ({
    productCategory: baseProduct?.category ?? "",
    dims: baseProduct ? formatDims(baseProduct.dimensions) : "",
    preferred: "whatsapp",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<{ file: File; error: string | null }[]>([]);
  const [done, setDone] = useState<Submitted | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLElement | null>(null);
  const setTop = (el: HTMLElement | null) => {
    topRef.current = el;
  };
  const clearError = (k: string) =>
    setErrors((cur) => {
      const next = { ...cur };
      delete next[k];
      return next;
    });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const v = e.target instanceof HTMLInputElement && e.target.type === "checkbox" ? (e.target.checked ? "yes" : "") : e.target.value;
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) clearError(k);
  };

  const basketLines = useMemo(
    () =>
      basket.items
        .map((i, index) => ({ ...i, index, product: getProduct(i.slug) }))
        .filter((i): i is typeof i & { product: NonNullable<typeof i.product> } => Boolean(i.product)),
    [basket.items],
  );

  const field = (name: string, label: string, opts: { required?: boolean; type?: string; as?: "textarea"; dir?: "ltr"; placeholder?: string } = {}) => (
    <div className={opts.as === "textarea" ? "sm:col-span-2" : ""}>
      <Label htmlFor={name} className={labelCls}>
        {label} {opts.required ? <span className="text-accent-500">*</span> : <span className="font-normal text-muted-foreground">({f.optional})</span>}
      </Label>
      {opts.as === "textarea" ? (
        <Textarea id={name} rows={4} value={values[name] ?? ""} onChange={set(name)} />
      ) : (
        <Input
          id={name}
          type={opts.type ?? "text"}
          dir={opts.dir}
          placeholder={opts.placeholder}
          value={values[name] ?? ""}
          onChange={set(name)}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `${name}-err` : undefined}
          autoComplete={{ email: "email", phone: "tel", company: "organization", contactPerson: "name", city: "address-level2", jobTitle: "organization-title" }[name]}
        />
      )}
      {errors[name] && <p id={`${name}-err`} className="mt-1.5 text-sm font-medium text-accent-600">{errors[name]}</p>}
    </div>
  );

  const select = (name: string, label: string, options: { value: string; label: string }[]) => (
    <div>
      <Label htmlFor={name} className={labelCls}>{label} <span className="font-normal text-muted-foreground">({f.optional})</span></Label>
      <select id={name} className={nativeSelect} value={values[name] ?? ""} onChange={set(name)}>
        <option value="">{f.unknown}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((cur) => [...cur, ...Array.from(list).map((file) => ({ file, error: fileProblem(file, t) }))]);
    if (errors.files) clearError("files");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = buildSchema(t).safeParse(values);
    const errs: Record<string, string> = {};
    if (!result.success) for (const issue of result.error.issues) errs[String(issue.path[0])] ??= issue.message;
    if (type === "products" && basketLines.length === 0) errs.basket = q.errors.basket;
    if (type === "boq" && files.length === 0) errs.files = q.errors.required;
    if (files.some((x) => x.error)) errs.files = files.find((x) => x.error)!.error!;
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid=true], [data-error]")?.focus());
      return;
    }

    const ref = makeReference();
    const opt = (k: string, map?: Record<string, string>) => (values[k] ? (map?.[values[k]] ?? values[k]) : "");
    const catMap = Object.fromEntries(categories.map((c) => [c.slug, categoryName(c, lang)]));
    const envMap = { indoor: f.indoor, outdoor: f.outdoor };
    const mountMap = { wall: f.wall, flush: f.flush, floor: f.floor };

    const lines: [string, string][] = (
      [
        [f.company, opt("company")],
        [f.businessType, opt("businessType")],
        [f.contactPerson, opt("contactPerson")],
        [f.jobTitle, opt("jobTitle")],
        [f.email, opt("email")],
        [f.phone, opt("phone")],
        [f.whatsapp, opt("whatsapp")],
        [f.city, opt("city")],
        [f.projectName, opt("projectName")],
        [f.projectType, opt("projectType")],
        [f.projectLocation, opt("projectLocation")],
        [f.consultant, opt("consultant")],
        [f.contractor, opt("contractor")],
        [f.deadline, opt("deadline")],
        [f.deliveryDate, opt("deliveryDate")],
        ...(type === "custom"
          ? ([
              [f.productCategory, opt("productCategory", catMap)],
              [f.dims, opt("dims")],
              [f.quantity, opt("quantity")],
              [f.environment, opt("environment", envMap)],
              [f.material, opt("material")],
              [f.thickness, opt("thickness")],
              [f.finish, opt("finish")],
              [f.mounting, opt("mounting", mountMap)],
              [f.needHelp, values.needHelp ? "✓" : ""],
            ] as [string, string][])
          : []),
        [f.notes, opt("notes")],
        [f.preferred, opt("preferred", q.preferredOptions)],
      ] as [string, string][]
    ).filter(([, v]) => v);

    const items =
      type === "products"
        ? basketLines.map(
            (i) =>
              `${i.qty} × ${productName(i.product, lang)} [${i.product.code}] ${formatDims(i.product.dimensions)} (${i.kind === "custom" ? t.basket.custom : t.basket.standard})${i.notes ? ` — ${i.notes}` : ""}`,
          )
        : [];
    const fileNames = files.map((x) => x.file.name);

    const text = [
      `${q.title} — ${ref}`,
      `${q.done.type}: ${q.types[type]}`,
      "",
      ...items.map((s, n) => `${n + 1}. ${s}`),
      ...(items.length ? [""] : []),
      ...lines.map(([k, v]) => `${k}: ${v}`),
      ...(fileNames.length ? ["", `${q.done.files}: ${fileNames.join(", ")}`] : []),
    ].join("\n");

    setDone({ ref, type, text, lines, items, files: fileNames });
    if (type === "products") basket.clear();
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  if (done) {
    return (
      <div ref={setTop} className="mx-auto max-w-3xl scroll-mt-40">
        <div className="rounded-3xl border border-line bg-white p-7 md:p-12" role="status">
          <CheckCircle2 className="size-12 text-emerald-600" aria-hidden />
          <h2 className="t-h2 mt-5">{q.done.title}</h2>
          <p className="t-lead mt-3">{q.done.text}</p>
          <dl className="mt-6 grid gap-4 rounded-xl bg-surface p-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">{q.done.reference}</dt>
              <dd className="font-mono text-2xl font-bold text-navy-900" dir="ltr" style={{ textAlign: "start" }}>{done.ref}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">{q.done.type}</dt>
              <dd className="font-semibold">{q.types[done.type]}</dd>
            </div>
          </dl>

          <div className="no-print mt-6 flex flex-wrap gap-3">
            <a href={whatsappLink(done.text)} target="_blank" rel="noopener" className={buttonVariants({ variant: "whatsapp", size: "lg" })}>
              <WhatsAppIcon className="size-5" /> {q.done.sendWhatsapp}
            </a>
            <a href={`mailto:${contact.email}?subject=${encodeURIComponent(`${q.title} ${done.ref}`)}&body=${encodeURIComponent(done.text)}`} className={buttonVariants({ size: "lg" })}>
              <Mail className="size-4" aria-hidden /> {q.done.sendEmail}
            </a>
            <button type="button" onClick={() => window.print()} className={buttonVariants({ variant: "outline", size: "lg" })}>
              <Printer className="size-4" aria-hidden /> {q.done.print}
            </button>
          </div>

          <h3 className="mt-10 font-semibold text-navy-900">{q.done.summary}</h3>
          {done.items.length > 0 && (
            <ol className="mt-3 list-decimal space-y-1.5 ps-5 text-base">
              {done.items.map((s) => <li key={s}>{s}</li>)}
            </ol>
          )}
          <dl className="mt-4 divide-y divide-line rounded-xl border border-line text-base">
            {done.lines.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[40%_1fr] gap-3 px-4 py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="break-words font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          {done.files.length > 0 && (
            <div className="mt-4 rounded-xl bg-amber-50 p-5 text-base text-amber-900">
              <p className="font-semibold">{q.done.files}:</p>
              <ul className="mt-1 list-disc ps-5">{done.files.map((n) => <li key={n}>{n}</li>)}</ul>
              <p className="mt-2">{q.filesNote}</p>
            </div>
          )}

          <div className="no-print mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
            <Link href={`/${lang}/products`} className={buttonVariants({ variant: "outline", size: "lg" })}>{q.done.back}</Link>
            <button
              type="button"
              className={buttonVariants({ variant: "outline", size: "lg" })}
              onClick={() => {
                setDone(null);
                setFiles([]);
                setValues({ preferred: "whatsapp" });
              }}
            >
              {q.done.newRequest}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_380px] xl:gap-12" ref={setTop}>
      <div className="space-y-8">
        {/* Request type */}
        <fieldset>
          <legend className="sr-only">{q.done.type}</legend>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {requestTypes.map((rt) => (
              <label key={rt} className="cursor-pointer rounded-2xl border-2 border-line bg-white p-5 transition-colors hover:border-brand-500/50 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500">
                <input type="radio" name="type" value={rt} checked={type === rt} onChange={() => setType(rt)} className="sr-only" />
                <span className="block text-lg font-semibold text-navy-900">
                  {q.types[rt]}
                  {rt === "products" && basket.count > 0 && <span className="ms-2 rounded-full bg-accent-500 px-2 text-xs text-white">{basket.count}</span>}
                </span>
                <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-muted-foreground">{q.typeHelp[rt]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Basket */}
        {type === "products" && (
          <section className="rounded-2xl border border-line bg-white p-6 md:p-8" data-error={errors.basket ? "" : undefined} tabIndex={errors.basket ? -1 : undefined}>
            <h2 className="text-2xl font-bold">
              {t.basket.title} <span className="text-base font-normal text-muted-foreground">({basketLines.length} {t.basket.items})</span>
            </h2>
            {errors.basket && <p className="mt-2 text-sm text-accent-600">{errors.basket}</p>}
            {basketLines.length === 0 ? (
              <div className="mt-4 rounded-lg bg-surface p-6 text-center">
                <p className="text-muted-foreground">{t.basket.empty}</p>
                <Link href={`/${lang}/products`} className={buttonVariants({ size: "lg", className: "mt-5" })}>{t.basket.emptyCta}</Link>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {basketLines.map((i) => (
                  <li key={`${i.slug}-${i.index}`} className="grid gap-3 py-4 sm:grid-cols-[96px_1fr]">
                    <div className="relative size-24 overflow-hidden rounded-xl bg-surface">
                      {i.product.images[0] && <Image src={i.product.images[0]} alt="" fill sizes="96px" className="scale-[1.045] object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link href={`/${lang}/products/${i.slug}`} className="text-lg font-semibold text-navy-900 hover:text-brand-600">{productName(i.product, lang)}</Link>
                          <p className="text-sm text-muted-foreground" dir="ltr" style={{ textAlign: "start" }}>{i.product.code} · {formatDims(i.product.dimensions)} mm</p>
                        </div>
                        <button type="button" onClick={() => basket.remove(i.index)} className="rounded-md p-1.5 text-muted-foreground hover:bg-surface hover:text-accent-600" aria-label={`${t.basket.remove}: ${productName(i.product, lang)}`}>
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap items-end gap-3">
                        <label className="w-28">
                          <span className={labelCls}>{t.basket.qty}</span>
                          <Input type="number" min={1} value={i.qty} onChange={(e) => basket.update(i.index, { qty: Math.max(1, Number(e.target.value) || 1) })} />
                        </label>
                        <label className="w-40">
                          <span className={labelCls}>{t.basket.type}</span>
                          <select className={nativeSelect} value={i.kind} onChange={(e) => basket.update(i.index, { kind: e.target.value as "standard" | "custom" })}>
                            <option value="standard">{t.basket.standard}</option>
                            <option value="custom">{t.basket.custom}</option>
                          </select>
                        </label>
                        <label className="min-w-48 flex-1">
                          <span className={labelCls}>{t.basket.notes}</span>
                          <Input value={i.notes} onChange={(e) => basket.update(i.index, { notes: e.target.value })} />
                        </label>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {basketLines.length > 0 && (
              <Link href={`/${lang}/products`} className="mt-4 inline-block text-base font-semibold text-brand-600 hover:underline">+ {t.basket.continue}</Link>
            )}
          </section>
        )}

        {/* Custom manufacturing */}
        {type === "custom" && (
          <section className="rounded-2xl border border-line bg-white p-6 md:p-8">
            <h2 className="text-2xl font-bold">{q.request}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {select("productCategory", f.productCategory, categories.map((c) => ({ value: c.slug, label: categoryName(c, lang) })))}
              {field("dims", f.dims, { dir: "ltr", placeholder: "600 × 400 × 150" })}
              {field("quantity", f.quantity, { type: "number" })}
              {select("environment", f.environment, [{ value: "indoor", label: f.indoor }, { value: "outdoor", label: f.outdoor }])}
              {field("material", f.material)}
              {field("thickness", f.thickness, { placeholder: "1.2 mm" })}
              {field("finish", f.finish)}
              {select("mounting", f.mounting, [{ value: "wall", label: f.wall }, { value: "flush", label: f.flush }, { value: "floor", label: f.floor }])}
              <label className="flex items-center gap-3 rounded-xl bg-brand-50 p-4 text-base font-medium sm:col-span-2">
                <input type="checkbox" className="size-4 accent-brand-600" checked={values.needHelp === "yes"} onChange={set("needHelp")} />
                {f.needHelp}
              </label>
            </div>
          </section>
        )}

        {/* Company */}
        <section className="rounded-2xl border border-line bg-white p-6 md:p-8">
          <h2 className="text-2xl font-bold">{q.company}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {field("company", f.company, { required: true })}
            {select("businessType", f.businessType, q.businessTypes.map((b) => ({ value: b, label: b })))}
            {field("contactPerson", f.contactPerson, { required: true })}
            {field("jobTitle", f.jobTitle)}
            {field("email", f.email, { required: true, type: "email", dir: "ltr" })}
            {field("phone", f.phone, { required: true, type: "tel", dir: "ltr", placeholder: "01xxxxxxxxx" })}
            {field("whatsapp", f.whatsapp, { type: "tel", dir: "ltr" })}
            {field("city", f.city, { required: true })}
          </div>
        </section>

        {/* Project */}
        <section className="rounded-2xl border border-line bg-white p-6 md:p-8">
          <h2 className="text-2xl font-bold">{q.project}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {field("projectName", f.projectName)}
            {select("projectType", f.projectType, q.projectTypes.map((b) => ({ value: b, label: b })))}
            {field("projectLocation", f.projectLocation)}
            {field("consultant", f.consultant)}
            {field("contractor", f.contractor)}
            {field("deadline", f.deadline, { type: "date" })}
            {field("deliveryDate", f.deliveryDate, { type: "date" })}
            {field("notes", f.notes, { as: "textarea" })}
          </div>
        </section>

        {/* Attachments */}
        <section className="rounded-2xl border border-line bg-white p-6 md:p-8" data-error={errors.files ? "" : undefined} tabIndex={errors.files ? -1 : undefined}>
          <h2 className="text-2xl font-bold">
            {q.attachments} {type === "boq" && <span className="text-accent-500">*</span>}
          </h2>
          <label
            className="mt-6 flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-input p-10 text-center hover:border-brand-500 hover:bg-brand-50"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              addFiles(e.dataTransfer.files);
            }}
          >
            <Paperclip className="size-7 text-brand-600" aria-hidden />
            <span className="text-base font-medium">{f.files}</span>
            <input ref={fileInput} type="file" multiple className="sr-only" accept={ALLOWED_EXT.map((x) => `.${x}`).join(",")} onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
          </label>
          {errors.files && <p className="mt-2 text-sm text-accent-600">{errors.files}</p>}
          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((x, n) => (
                <li key={`${x.file.name}-${n}`} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-base ${x.error ? "border-accent-500 bg-red-50" : "border-line"}`}>
                  <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="min-w-0 flex-1 truncate">{x.file.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground" dir="ltr">{(x.file.size / 1024 / 1024).toFixed(1)} MB</span>
                  {x.error && <span className="shrink-0 text-xs text-accent-600">{x.error}</span>}
                  <button type="button" onClick={() => setFiles((cur) => cur.filter((_, i) => i !== n))} className="rounded p-1 hover:bg-surface" aria-label={`${q.removeFile}: ${x.file.name}`}>
                    <X className="size-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-sm text-muted-foreground">{q.filesNote}</p>
        </section>
      </div>

      {/* Sidebar */}
      <aside>
        <div className="sticky top-36 space-y-6 rounded-2xl border border-line bg-surface p-6">
          <fieldset>
            <legend className={labelCls}>{f.preferred}</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(q.preferredOptions) as (keyof typeof q.preferredOptions)[]).map((k) => (
                <label key={k} className="cursor-pointer rounded-full border border-line bg-white px-4 py-2 text-base has-[:checked]:border-brand-600 has-[:checked]:bg-brand-600 has-[:checked]:text-white">
                  <input type="radio" name="preferred" value={k} checked={values.preferred === k} onChange={set("preferred")} className="sr-only" />
                  {q.preferredOptions[k]}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label className="flex items-start gap-3 text-base">
              <input type="checkbox" className="mt-0.5 size-4 accent-brand-600" checked={values.consent === "yes"} onChange={set("consent")} aria-invalid={Boolean(errors.consent)} />
              <span>{f.consent}</span>
            </label>
            {errors.consent && <p className="mt-1 text-sm text-accent-600">{errors.consent}</p>}
          </div>
          {Object.keys(errors).length > 0 && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-accent-600" role="alert">{q.errors.summary}</p>
          )}
          <Button type="submit" size="lg" className="h-13 w-full text-lg">{q.submit}</Button>
          <p className="text-center text-sm text-muted-foreground">
            {t.contact.phone}: <a href={contact.phoneHref} dir="ltr" className="font-medium hover:text-brand-600">{contact.phoneDisplay}</a>
          </p>
        </div>
      </aside>
    </form>
  );
}

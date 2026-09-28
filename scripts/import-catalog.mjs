// Normalizes the existing Lovable catalog export (scripts/source/*.json) into
// data/products.json + data/categories.json for the static MVP.
// Usage: node scripts/import-catalog.mjs [--dry-run]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import vm from "node:vm";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");
const src = (f) => JSON.parse(readFileSync(join(root, "scripts/source", f), "utf8"));

const rawProducts = src("products.json");
const rawCategories = src("categories.json");

// Nour datasheet export (clean photos, dimension drawings, configuration) + local media from scripts/fetch-media.mjs.
const dsCtx = { window: {} };
vm.runInNewContext(readFileSync(join(root, "scripts/source/datasheet-data.js"), "utf8"), dsCtx);
const datasheet = Object.fromEntries(dsCtx.window.NOUR_DATA.products.map((p) => [p.id, p]));
const media = existsSync(join(root, "scripts/source/media-manifest.json")) ? src("media-manifest.json") : {};
// Prefer the frame-trimmed copy produced by scripts/trim-frames.mjs when it exists.
const cleanUrl = (url) => {
  const clean = url.replace(/.[a-z]+$/i, ".clean.webp");
  return existsSync(join(root, "public", clean)) ? clean : url;
};
// The datasheet also has AI-inferred configuration (breakers, meters, phase); spot checks found errors
// (e.g. mo-3-switches shows 3 meters but is recorded as 1), so it is NOT published.

const CATEGORY_META = {
  "lines-only": { code: "LO", en: "Lines-Only Panels", enDesc: "Distribution panels for circuit breakers (lines) without a meter, in all sizes." },
  "meter-only": { code: "MO", en: "Meter-Only Panels", enDesc: "Single and multi-meter panels for buildings, factories and projects." },
  "lines-meter": { code: "LM", en: "Lines + Meter Panels", enDesc: "Combined panels housing an energy meter and multiple breaker lines." },
  "smart-panels": { code: "SP", en: "Smart Panels", enDesc: "Smart panels in multiple sizes, made to the client's requirements." },
  communications: { code: "CP", en: "Communication Panels", enDesc: "Horizontal, vertical and plastic-front communication panels." },
  "junction-boxes": { code: "JB", en: "Junction Boxes", enDesc: "Metal junction boxes in multiple sizes for cable distribution." },
  "nail-boxes": { code: "NB", en: "Nail Boxes", enDesc: "Metal nail-mounted boxes in a variety of sizes." },
};

// Slugs in the source that are Arabic or inconsistent -> clean English slugs.
const SLUG_FIX = {
  "لوحة-عداد-مفتاح-ثنائي": "lm-meter-double-switch",
  "بواط-مقاس-30-50-10-سم": "jb-10x50x30",
  "بواط-مقاس-30-60-10-سم": "jb-10x60x30",
};

// Arabic name normalization (typos / notation) — original kept in sourceName.
const AR_NAME_FIX = {
  "jb-10x50x30": "بواط مقاس 10×50×30",
  "jb-10x60x30": "بواط مقاس 10×60×30",
  "lm-24-card-mobile": "لوحة 24 خط بالعداد 3 فاز كارت شحن أوميجا متحركة",
};

// Manually written English names (draft — to be reviewed by the customer).
const EN = {
  "comm-horizontal": "Communication Panel – Horizontal",
  "comm-vertical": "Communication Panel – Vertical",
  "comm-plastic-front": "Communication Panel – Plastic Front",
  "lm-220-triple": "220V Meter Panel with Triple Switch",
  "lm-12-outside": "12-Line Panel with Meter (Outside Apartment)",
  "lm-meter-double-switch": "Meter Panel with Double Switch",
  "lm-12-inside": "12-Line Panel with Meter (Inside Apartment)",
  "lm-14-card-charger": "14-Line Panel with Prepaid-Card Meter",
  "lm-3phase-card-general": "3-Phase Prepaid-Card Panel with Main Breaker",
  "lm-16-omega-fixed": "16-Line Panel with Meter – Fixed Omega Rail",
  "lm-16-omega-mobile": "16-Line Panel with Meter – Movable Omega Rail",
  "lm-18-card-charger": "18-Line 3-Phase Panel with Prepaid-Card Meter",
  "lm-24-card-mobile": "24-Line 3-Phase Prepaid-Card Meter Panel – Movable Omega Rail",
  "lo-12-h-v": "12-Line Panel – Horizontal / Vertical",
  "lo-14-2rows": "14-Line Panel – Two Rows",
  "lo-16-3p": "16-Line 3-Phase Panel with Main Breaker",
  "lo-12-omega-mobile": "12-Line Panel with Breaker – Movable Omega Rail",
  "lo-18-omega-mobile": "18-Line Panel – Movable Omega Rail",
  "lo-18-3p-general": "18-Line 3-Phase Panel with Main Breaker",
  "lo-24-3p": "24-Line 3-Phase Panel with Main Breaker (490 mm)",
  "lo-24-lines": "24-Line Panel",
  "lo-18-3p-fixed": "18-Line 3-Phase Panel with Main Breaker – Fixed Omega Rail",
  "lo-24-3p-omega": "24-Line 3-Phase Panel with Main Breaker (470 mm)",
  "lo-36-omega-mobile": "36-Line 3-Phase Panel with Main Breaker – Movable Omega Rail",
  "mo-220-card": "220V Prepaid-Card Meter Panel",
  "mo-220-factories": "220V Meter Panel – Factories",
  "mo-3p-factories": "3-Phase Meter Panel – Factories",
  "mo-3p-card": "3-Phase Prepaid-Card Meter Panel",
  "mo-2card-3p": "Prepaid-Card Meter Panel – 2 / 3 Phase",
  "mo-3-switches": "Meter Panel with 3 Breakers + Indicator Lamps",
  "mo-4-switches": "Meter Panel with 4 Breakers + Indicator Lamps",
  "mo-6-switches": "Meter Panel with 6 Breakers + Indicator Lamps",
  "mo-8-switches": "Meter Panel with 8 Breakers + Indicator Lamps",
  "mo-10meter": "10-Meter Panel with Breakers + Indicator Lamps",
  "mo-12meter": "12-Meter Panel with Breakers + Indicator Lamps",
  "smart-40x40": "Smart Panel 40×40×12",
  "smart-40x60": "Smart Panel 40×60×12",
  "smart-40x80": "Smart Panel 40×80×12",
  "smart-60x80": "Smart Panel 60×80×12",
};

const report = [];
const catBySrcId = Object.fromEntries(rawCategories.map((c) => [c.id, c.slug]));

const categories = rawCategories
  .filter((c) => c.is_visible)
  .sort((a, b) => a.display_order - b.display_order)
  .map((c) => {
    const meta = CATEGORY_META[c.slug];
    if (!meta) throw new Error(`Unknown category slug ${c.slug}`);
    return { slug: c.slug, code: meta.code, nameAr: c.name, nameEn: meta.en, descAr: c.description.replace("بواب مسمار", "بواطات مسمار"), descEn: meta.enDesc, image: c.image_url || null };
  });

const counters = {};
const seenDims = new Map();
const products = rawProducts
  .filter((p) => p.is_visible)
  .map((p) => ({ ...p, cat: catBySrcId[p.category_id] }))
  .sort((a, b) => categories.findIndex((c) => c.slug === a.cat) - categories.findIndex((c) => c.slug === b.cat) || a.display_order - b.display_order)
  .map((p) => {
    const slug = SLUG_FIX[p.slug] ?? p.slug;
    if (SLUG_FIX[p.slug]) report.push(`Slug normalized: "${p.slug}" -> ${slug}`);
    const meta = CATEGORY_META[p.cat];
    counters[p.cat] = (counters[p.cat] ?? 0) + 1;
    const code = `NR-${meta.code}-${String(counters[p.cat]).padStart(2, "0")}`;

    let nameAr = (AR_NAME_FIX[slug] ?? p.name).replace(/\s+/g, " ").trim();
    if (nameAr.startsWith("بواب مسمار")) {
      nameAr = nameAr.replace("بواب مسمار", "بواط مسمار");
      report.push(`Typo fixed ("بواب" -> "بواط"): ${slug}`);
    }
    if (nameAr !== p.name.trim()) report.push(`Arabic name normalized: "${p.name.trim()}" -> "${nameAr}"`);

    let nameEn = EN[slug];
    const size = slug.match(/(\d+)x(\d+)x(\d+)/);
    if (!nameEn && size && p.cat === "junction-boxes") nameEn = `Junction Box ${size[1]}×${size[2]}×${size[3]} cm`;
    if (!nameEn && size && p.cat === "nail-boxes") nameEn = `Nail Box ${size[1]}×${size[2]}×${size[3]} cm`;
    if (!nameEn) {
      nameEn = nameAr;
      report.push(`MISSING English name: ${slug}`);
    }

    const metal = p.cat === "junction-boxes" || p.cat === "nail-boxes";
    const dims = { h: p.dimensions_h, w: p.dimensions_w, d: p.dimensions_d };
    const dimKey = `${p.cat}:${dims.h}x${dims.w}x${dims.d}`;
    if (seenDims.has(dimKey)) report.push(`Possible duplicate (same category + dimensions): ${seenDims.get(dimKey)} / ${slug}`);
    else seenDims.set(dimKey, slug);
    const ds = datasheet[p.id];
    const local = media[p.id];
    const photos = local?.photos?.length ? local.photos.map(cleanUrl) : (p.images ?? []);
    if (!ds) report.push(`Not in datasheet: ${slug}`);
    if (!local?.drawing) report.push(`No dimension drawing: ${slug}`);
    if (!photos.length) report.push(`No image: ${slug}`);

    return {
      code,
      slug,
      category: p.cat,
      nameAr,
      nameEn,
      dimensions: dims,
      material: metal ? "metal" : null,
      images: photos,
      drawing: local?.drawing ?? null,
      featured: Boolean(p.is_featured),
      specStatus: "needs-review",
      source: `catalog-nour.lovable.app/products/${p.slug} + datasheet-4vph-blue.vercel.app (id ${p.id})`,
    };
  });

// Category cover = first product's clean photo (the old category images have framed collages).
for (const c of categories) c.image = products.find((p) => p.category === c.slug && p.images.length)?.images[0] ?? c.image;

report.unshift(`Imported ${products.length} products in ${categories.length} categories.`, `Prices: NOT imported (public B2B site shows no prices).`);

console.log(report.join("\n"));
if (!dryRun) {
  mkdirSync(join(root, "data"), { recursive: true });
  writeFileSync(join(root, "data/products.json"), JSON.stringify(products, null, 2));
  writeFileSync(join(root, "data/categories.json"), JSON.stringify(categories, null, 2));
  writeFileSync(join(root, "scripts/import-report.md"), `# Import report\n\n${report.map((l) => `- ${l}`).join("\n")}\n`);
  console.log("Wrote data/products.json, data/categories.json, scripts/import-report.md");
}

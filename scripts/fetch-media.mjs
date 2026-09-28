// Downloads product photos + dimension drawings from the Nour datasheet site into public/media/products.
// Usage: node scripts/fetch-media.mjs
import { writeFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://datasheet-4vph-blue.vercel.app/";
const ctx = { window: {} };
vm.runInNewContext(readFileSync(join(root, "scripts/source/datasheet-data.js"), "utf8"), ctx);
const ds = ctx.window.NOUR_DATA;
const outDir = join(root, "public/media/products");
mkdirSync(outDir, { recursive: true });

const manifest = {};
let ok = 0, fail = 0;
for (const p of ds.products) {
  const entry = { photos: [], drawing: null };
  const items = (p.imageItems ?? []).filter((i) => i.visible !== false).sort((a, b) => a.order - b.order);
  const photos = items.length ? items.map((i) => i.src) : p.mainImage ? [p.mainImage] : [];
  const jobs = photos.map((src, n) => ({ src, name: `${p.id}-${n + 1}${extname(src) || ".webp"}`, kind: "photo" }));
  if (p.dimensionImage) jobs.push({ src: p.dimensionImage, name: `${p.id}-drawing${extname(p.dimensionImage) || ".webp"}`, kind: "drawing" });
  for (const j of jobs) {
    const file = join(outDir, j.name);
    if (!existsSync(file)) {
      const res = await fetch(new URL(j.src, BASE));
      if (!res.ok) { console.log("FAIL", res.status, j.src); fail++; continue; }
      writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    }
    ok++;
    const url = `/media/products/${j.name}`;
    if (j.kind === "photo") entry.photos.push(url); else entry.drawing = url;
  }
  manifest[p.id] = entry;
}
if (ds.company?.heroImagePath) {
  const res = await fetch(new URL(ds.company.heroImagePath, BASE));
  if (res.ok) writeFileSync(join(root, "public/media/company/hero-panels.webp"), Buffer.from(await res.arrayBuffer()));
}
writeFileSync(join(root, "scripts/source/media-manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`downloaded/kept ${ok}, failed ${fail}`);

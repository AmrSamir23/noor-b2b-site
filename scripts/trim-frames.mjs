// The source product photos have a blue frame baked in. Detect the inner white area by scanning
// inward from each edge (several scanlines) until pixels become near-white, then crop to it.
// Usage: node scripts/trim-frames.mjs
import sharp from "sharp";
import { readdirSync, existsSync } from "node:fs";
import { join, dirname, parse } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "public/media/products");
const isWhite = (d, i) => d[i] > 215 && d[i + 1] > 215 && d[i + 2] > 215 && Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]) < 25;
const isFrame = (d, i) => d[i + 2] > 150 && d[i + 2] - d[i] > 60; // blue-dominant pixel

async function cleanOne(src, out) {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const px = (x, y) => (y * W + x) * 3;
  const fractions = [0.2, 0.35, 0.5, 0.65, 0.8];
  // Only trim if the image edge is actually blue frame.
  const edgeBlue = fractions.filter((f) => isFrame(data, px(1, Math.floor(H * f))) || isFrame(data, px(Math.floor(W * f), 1))).length;
  if (edgeBlue < 2) return false;
  const scan = (len, get) => {
    const hits = fractions.map((f) => {
      for (let k = 0; k < len * 0.25; k++) if (isWhite(data, get(k, f))) return k;
      return 0;
    });
    return Math.max(...hits);
  };
  const left = scan(W, (k, f) => px(k, Math.floor(H * f)));
  const right = scan(W, (k, f) => px(W - 1 - k, Math.floor(H * f)));
  const top = scan(H, (k, f) => px(Math.floor(W * f), k));
  const bottom = scan(H, (k, f) => px(Math.floor(W * f), H - 1 - k));
  const pad = Math.round(Math.min(W, H) * 0.008);
  const box = { left: left + pad, top: top + pad, width: W - left - right - pad * 2, height: H - top - bottom - pad * 2 };
  if (box.width < W * 0.6 || box.height < H * 0.6) return false;
  await sharp(src).extract(box).webp({ quality: 86 }).toFile(out);
  return `${W}x${H} -> ${box.width}x${box.height}`;
}

let cleaned = 0, skipped = 0;
for (const f of readdirSync(dir)) {
  if (f.includes("-drawing") || f.includes(".clean.")) continue;
  const out = join(dir, `${parse(f).name}.clean.webp`);
  if (existsSync(out)) continue;
  const r = await cleanOne(join(dir, f), out);
  if (r) cleaned++; else skipped++;
  if (r && cleaned <= 3) console.log(f, r);
}
console.log({ cleaned, skipped });

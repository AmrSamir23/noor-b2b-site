# Content needed from Nour before launch

The site uses only information and images published on Nour's own sites. Nothing is invented. Where content is missing, the site shows "pending" or leaves it out.

## Sources used
| Source | What we took |
|---|---|
| catalog-nour.lovable.app | 58 products, categories, dimensions |
| datasheet-4vph-blue.vercel.app | Product photos (frames trimmed automatically) and **52 dimension drawings** |
| nour-company-profile.vercel.app | Factory image, 8 sector photos, 5 equipment photos, leadership portraits and bios, vision, company story, **12 project references and client logos**, second phone, Facebook, Maps link |
| nour-price-list.vercel.app | Cross-check of names and dimensions only (**prices not used**) |
| nourmodernlighting.com | Contact details, logo |

## Contact & company
- [ ] **Email spelling.** `nourformodernlighting111@gmail.com` is used on the main site. `nourformodernligting111` (missing "h") appears on the profile, catalog and datasheet. **Please confirm which one receives mail.** A domain email (e.g. `sales@nourmodernlighting.com`) is recommended.
- [ ] Working hours (currently shown as "to be confirmed")
- [ ] Separate Sales / Technical Support contacts, if any (we show 01003510077 and 01006300039)

## Trust content
- [ ] **Permission to publish the 12 project references and client logos** (TMG, Tatweer Misr, Modon, NUCA, etc.). These are shown as published on Nour's profile site. Please confirm, and add the products supplied and the year if possible.
- [ ] The factory hero image looks like a marketing composite. Real photos of the factory and production line would add credibility.
- [ ] Certificates (ISO, Egyptian standards, etc.) as PDF scans
- [ ] Company profile PDF and catalog PDF for a downloads section

## Product data
- [ ] Review the **English product names** and English company texts (drafted by us)
- [ ] Verified technical specs per product: sheet thickness, material, paint/finish, protection rating (IP), indoor/outdoor, mounting type
- [ ] Missing dimension drawings: lo-18-omega-mobile, smart-40x40, smart-40x60, smart-40x80, smart-60x80, jb-10x30x30
- [ ] The datasheet also contains AI-generated configuration data (number of breakers, meters, phase). **We do not publish it** because spot checks found errors: "meter panel with 3 switches" shows 3 meters in its photo, but the data records 1. Please supply verified data.
- [ ] Confirm product counts. The price list and catalog disagree: Lines-only has 12 vs 11 items and Nail boxes has 12 vs 11.
- [ ] Several products share identical dimensions (e.g. 12-line horizontal/vertical and 14-line two-row are both 350×270×90). Please confirm these are distinct products.
- [ ] Product codes: we generated `NR-XX-NN` codes. Replace them with Nour's internal codes if they exist.
- [ ] Prices are **not** shown on the new site. Decide whether dealers should get a private price list (phase 2).

## Normalizations already applied (see `scripts/import-report.md`)
- "بواب مسمار" → "بواط مسمار" (typo in 10 products)
- "بواط مقاس 30*50*10 سم" → "بواط مقاس 10×50×30" (consistent notation)
- "أوميغا" → "أوميجا"
- Arabic URL slugs replaced with clean English slugs
- Blue frames removed from product photos (`scripts/trim-frames.mjs`)

## Re-running the media pipeline
```bash
node scripts/fetch-media.mjs     # download datasheet photos + drawings
node scripts/trim-frames.mjs     # remove baked-in frames
node scripts/import-catalog.mjs  # rebuild data/products.json
```

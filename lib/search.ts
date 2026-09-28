// Normalizes Arabic/English text for forgiving search without changing stored content.
export function normalize(input: string) {
  return input
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "") // harakat + tatweel
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/\s*[×x*]\s*/g, "x")
    .replace(/[-–_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matches(haystack: string[], query: string) {
  const q = normalize(query);
  if (!q) return true;
  const text = normalize(haystack.join(" "));
  return q.split(" ").every((token) => text.includes(token));
}

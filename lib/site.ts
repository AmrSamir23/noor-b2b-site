export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);
export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

// Verified from nourmodernlighting.com + company profile.
// NOTE: the profile site spells the email "nourformodernligting111" (typo) — the main site's spelling is used here.
export const contact = {
  phoneDisplay: "+20 100 351 0077",
  phoneHref: "tel:+201003510077",
  whatsappNumber: "201003510077",
  email: "nourformodernlighting111@gmail.com",
  facebook: "https://www.facebook.com/",
  addressAr: "بلوك 4، 19 شارع جلال عامر، أنشاص الرمل، مدينة أنشاص الصناعية",
  addressEn: "Block 4, 19 Galal Amer St., Anshas Al-Raml, Anshas Industrial City, Egypt",
  mapEmbed: "https://www.google.com/maps?q=Anshas%20Industrial%20City%2C%20Egypt&output=embed",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Anshas+Industrial+City+Egypt",
};

export const whatsappLink = (text?: string) =>
  `https://wa.me/${contact.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

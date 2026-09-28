import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "../globals.css";
import { dirOf, hasLocale, locales } from "@/lib/site";
import { getDict } from "@/lib/dict";
import { LocaleProvider } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDict(lang);
  return {
    // SITE_URL is read at build time (pages are pre-rendered), so set it as a build variable in Coolify.
    metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
    title: { default: t.meta.title, template: `%s | ${t.brand.name}` },
    description: t.meta.description,
    icons: { icon: "/logo.png" },
    alternates: { languages: { ar: "/ar", en: "/en" } },
    openGraph: { title: t.meta.title, description: t.meta.description, images: ["/logo.png"], locale: lang === "ar" ? "ar_EG" : "en_US" },
    robots: { index: false, follow: false }, // preview build — enable at launch
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);

  return (
    <html lang={lang} dir={dirOf(lang)} className={`${inter.variable} ${arabic.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <LocaleProvider locale={lang}>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-5 focus:py-3 focus:text-white">
            {t.nav.skip}
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer lang={lang} />
          <FloatingActions />
        </LocaleProvider>
      </body>
    </html>
  );
}

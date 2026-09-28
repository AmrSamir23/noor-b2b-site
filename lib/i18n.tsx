"use client";

import { createContext, useContext } from "react";
import { Direction } from "radix-ui";
import { Toaster } from "@/components/ui/sonner";
import { getDict } from "./dict";
import { dirOf, type Locale } from "./site";

const LocaleContext = createContext<Locale>("ar");

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const dir = dirOf(locale);
  return (
    <LocaleContext.Provider value={locale}>
      {/* Radix components (Sheet, Select…) read direction from here for correct RTL behaviour. */}
      <Direction.DirectionProvider dir={dir}>
        {children}
        <Toaster position={dir === "rtl" ? "bottom-left" : "bottom-right"} dir={dir} richColors={false} />
      </Direction.DirectionProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useDict() {
  return getDict(useContext(LocaleContext));
}

"use client";

import { useSyncExternalStore } from "react";

export type BasketItem = {
  slug: string;
  qty: number;
  kind: "standard" | "custom";
  notes: string;
};

const KEY = "nour-quote-basket-v1";
const EMPTY: BasketItem[] = [];
const listeners = new Set<() => void>();
let cache: BasketItem[] | null = null;

function read(): BasketItem[] {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed)
      ? parsed.filter(
          (x): x is BasketItem =>
            typeof x === "object" && x !== null && typeof x.slug === "string" && Number.isFinite(x.qty),
        )
      : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(items: BasketItem[]) {
  cache = items;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable (private mode) — basket still works for this page view.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useBasket() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);
  return {
    items,
    count: items.length,
    has: (slug: string) => items.some((i) => i.slug === slug),
    add: (slug: string, kind: BasketItem["kind"] = "standard") => {
      const cur = read();
      const existing = cur.find((i) => i.slug === slug && i.kind === kind);
      write(existing ? cur.map((i) => (i === existing ? { ...i, qty: i.qty + 1 } : i)) : [...cur, { slug, qty: 1, kind, notes: "" }]);
    },
    update: (index: number, patch: Partial<BasketItem>) => write(read().map((i, n) => (n === index ? { ...i, ...patch } : i))),
    remove: (index: number) => write(read().filter((_, n) => n !== index)),
    clear: () => write([]),
  };
}

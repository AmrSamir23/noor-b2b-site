import ar from "@/messages/ar";
import en from "@/messages/en";
import type { Locale } from "./site";

const dicts = { ar, en };
export const getDict = (locale: Locale) => dicts[locale];

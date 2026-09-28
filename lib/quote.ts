import { z } from "zod";
import type { Dict } from "@/messages/en";

export const requestTypes = ["products", "boq", "custom", "general"] as const;
export type RequestType = (typeof requestTypes)[number];
export const isRequestType = (v: string | null): v is RequestType => requestTypes.includes(v as RequestType);

export const ALLOWED_EXT = ["pdf", "xls", "xlsx", "csv", "doc", "docx", "dwg", "dxf", "jpg", "jpeg", "png", "zip"];
export const MAX_FILE_BYTES = 20 * 1024 * 1024;

export type FormValues = Record<string, string> & { consent?: string; needHelp?: string };

export function buildSchema(t: Dict) {
  const e = t.quote.errors;
  const req = z.string().trim().min(1, e.required);
  const opt = z.string().trim().optional();
  return z.object({
    company: req,
    businessType: opt,
    contactPerson: req,
    jobTitle: opt,
    email: z.string().trim().min(1, e.required).pipe(z.email(e.email)),
    phone: z.string().trim().regex(/^\+?[\d\s()-]{8,20}$/, e.phone),
    whatsapp: z.union([z.literal(""), z.string().trim().regex(/^\+?[\d\s()-]{8,20}$/, e.phone)]).optional(),
    city: req,
    consent: z.literal("yes", { error: e.consent }),
  });
}

export function makeReference(date = new Date()) {
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(2)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return `NR-${y}${m}${d}-${rand}`;
}

export function fileProblem(file: File, t: Dict): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXT.includes(ext)) return t.quote.errors.fileType;
  if (file.size > MAX_FILE_BYTES) return t.quote.errors.fileSize;
  return null;
}

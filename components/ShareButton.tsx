"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { useDict } from "@/lib/i18n";

export default function ShareButton() {
  const t = useDict();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ url, title: document.title });
      } catch {
        // user cancelled
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button type="button" onClick={share} className="inline-flex items-center gap-2 font-semibold text-brand-600 hover:underline">
      <Share2 className="size-5" aria-hidden />
      <span role="status">{copied ? t.products.copied : t.products.share}</span>
    </button>
  );
}

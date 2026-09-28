"use client";

import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { useBasket } from "@/lib/basket";
import { useDict, useLocale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export default function AddToQuoteButton({ slug, name, size = "lg", className }: { slug: string; name: string; size?: "sm" | "default" | "lg"; className?: string }) {
  const t = useDict();
  const lang = useLocale();
  const router = useRouter();
  const { add, has, count } = useBasket();
  const inBasket = has(slug);

  return (
    <Button
      type="button"
      size={size}
      variant={inBasket ? "secondary" : "default"}
      className={className}
      onClick={() => {
        add(slug);
        toast.success(t.products.added, {
          description: name,
          action: { label: `${t.nav.basket} (${count + (inBasket ? 0 : 1)})`, onClick: () => router.push(`/${lang}/quote`) },
        });
      }}
    >
      {inBasket ? <Check aria-hidden /> : <Plus aria-hidden />}
      {inBasket ? t.products.added : t.products.addToQuote}
    </Button>
  );
}


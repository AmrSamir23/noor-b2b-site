import Image from "next/image";
import { Box } from "lucide-react";

// Product photos are frame-trimmed studio shots on white (scripts/trim-frames.mjs), so show the whole product.
export default function ProductImage({ src, alt, sizes, className = "", priority }: { src?: string; alt: string; sizes: string; className?: string; priority?: boolean }) {
  if (!src) {
    return (
      <div className="grid size-full place-items-center bg-gradient-to-br from-surface to-brand-50 text-brand-600/40">
        <Box className="size-16" aria-hidden />
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-contain p-[6%] ${className}`} />;
}

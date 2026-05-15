import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

interface Props {
  src: ImageWidget;
  alt: string;
}

/** Logo centralizada e inteira dentro do espaço do card (sem corte). */
export default function PartnerLogoFrame({ src, alt }: Props) {
  return (
    <div class="partner-logo-frame">
      <Image
        src={src}
        alt={alt}
        width={240}
        height={240}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

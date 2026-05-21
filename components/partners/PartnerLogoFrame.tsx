import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

interface Props {
  src: ImageWidget;
  alt: string;
}

export default function PartnerLogoFrame({ src, alt }: Props) {
  return (
    <div class="partner-logo-frame">
      <Image
        src={src}
        alt={alt}
        width={156}
        height={156}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

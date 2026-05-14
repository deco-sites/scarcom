import { useMemo } from "preact/hooks";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

/** @titleBy altText */
export interface PartnerLogo {
  image: ImageWidget;
  altText: string;
}

export interface Props {
  /**
   * @title Título — trecho em azul
   * @default +100 parceiros
   */
  titlePart1?: string;
  /**
   * @title Título — trecho em cinza
   * @default confiam na Scarcom
   */
  titlePart2?: string;
  /**
   * @title Descrição
   * @format textarea
   */
  description?: string;
  /**
   * @title Texto do botão
   * @default Ver mais parceiros
   */
  buttonText?: string;
  /**
   * @title URL do botão (página de parceiros)
   * @description Use um caminho interno (ex.: /parceiros) ou URL completa.
   */
  buttonHref?: string;
  /** @title Logos dos parceiros */
  logos?: PartnerLogo[];
}

const PLACEHOLDER_LOGOS: PartnerLogo[] = [
  {
    altText: "Webmotors",
    image:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/fe7cd8ba-c954-45d6-9282-ee7d8ca8e3c7",
  },
  {
    altText: "KIA",
    image:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/637e8601-6b86-4979-aa97-68013a2a60fd",
  },
];

const MIN_GRID_ITEMS = 20;

function buildLogoGrid(source: PartnerLogo[]): PartnerLogo[] {
  if (!source.length) {
    return Array.from(
      { length: MIN_GRID_ITEMS },
      (_, i) => PLACEHOLDER_LOGOS[i % PLACEHOLDER_LOGOS.length],
    );
  }
  if (source.length >= MIN_GRID_ITEMS) return source;
  const out: PartnerLogo[] = [];
  for (let i = 0; i < MIN_GRID_ITEMS; i++) {
    out.push(source[i % source.length]);
  }
  return out;
}

export default function Partners({
  titlePart1 = "+100 parceiros",
  titlePart2 = "confiam na Scarcom",
  description =
    "Empresas que contam com a Scarcom para manter seus ambientes de tecnologia sempre funcionando.",
  buttonText = "Ver mais parceiros",
  buttonHref = "/parceiros",
  logos,
}: Props) {
  const gridLogos = useMemo(() => buildLogoGrid(logos ?? []), [logos]);

  const isExternal = Boolean(buttonHref?.startsWith("http"));

  return (
    <section class="w-full px-4 py-10 md:py-14 lg:py-16">
      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col overflow-hidden rounded-[28px] bg-[#E9F0F5] p-6 shadow-sm md:p-8 lg:flex-row lg:items-stretch lg:rounded-[32px] lg:p-10 lg:pb-10 lg:pl-10 lg:pr-0 lg:pt-10">
          <div class="mb-8 flex shrink-0 flex-col justify-center gap-5 lg:mb-0 lg:w-[40%] lg:max-w-md lg:pr-10">
            <h2 class="text-[26px] font-bold leading-[1.2] tracking-tight text-[#2d3748] md:text-[30px] lg:text-[32px]">
              <span class="text-[#1e6ba8]">{titlePart1}</span>
              {titlePart1 && titlePart2 ? " " : null}
              <span class="text-[#2d3748]">{titlePart2}</span>
            </h2>
            <p class="text-[15px] leading-relaxed text-[#4a5568] md:text-base">
              {description}
            </p>
            <div>
              <a
                href={buttonHref || "#"}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                class="inline-flex items-center justify-center rounded-full bg-[#004D80] px-7 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004D80] focus-visible:ring-offset-2"
              >
                {buttonText}
              </a>
            </div>
          </div>

          <div class="relative min-h-[220px] min-w-0 flex-1 overflow-hidden lg:min-h-[300px]">
            <div class="-mx-1 -my-2 grid w-[calc(100%+2.5rem)] max-w-none grid-cols-3 gap-2.5 py-2 pr-8 sm:grid-cols-4 sm:gap-3 sm:pr-10 md:w-[calc(100%+3.5rem)] lg:w-[calc(100%+4rem)] lg:grid-cols-4 lg:gap-3 lg:pr-12 xl:gap-4">
              {gridLogos.map((item, index) => (
                <div
                  key={`${item.altText}-${index}`}
                  class={`flex aspect-square items-center justify-center rounded-xl border border-black/[0.06] bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-4 ${
                    index % 2 === 1 ? "translate-y-2 sm:translate-y-3" : ""
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.altText || "Parceiro"}
                    width={160}
                    height={160}
                    class="max-h-full max-w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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

const NUM_COLUMNS = 4;
const MIN_ITEMS_PER_COLUMN = 5;

function normalizeSource(source: PartnerLogo[]): PartnerLogo[] {
  if (source.length) return source;
  return PLACEHOLDER_LOGOS;
}

function splitIntoColumns(items: PartnerLogo[], n: number): PartnerLogo[][] {
  const cols: PartnerLogo[][] = Array.from({ length: n }, () => []);
  items.forEach((item, i) => {
    cols[i % n]!.push(item);
  });
  return cols;
}

/** Uma coluna com altura suficiente para o loop; conteúdo duplicado para marquee infinito. */
function buildSeamlessColumnTrack(columnItems: PartnerLogo[]): PartnerLogo[] {
  const base = columnItems.length ? columnItems : PLACEHOLDER_LOGOS;
  const expanded: PartnerLogo[] = [];
  let i = 0;
  while (expanded.length < MIN_ITEMS_PER_COLUMN) {
    expanded.push(base[i % base.length]!);
    i++;
  }
  return [...expanded, ...expanded];
}

function LogoCard({ item }: { item: PartnerLogo }) {
  return (
    <div class="flex aspect-square w-full shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-3">
      <Image
        src={item.image}
        alt={item.altText || "Parceiro"}
        width={140}
        height={140}
        class="max-h-full max-w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function MarqueeColumn({
  track,
  direction,
  durationSec,
}: {
  track: PartnerLogo[];
  direction: "up" | "down";
  durationSec: number;
}) {
  const animClass =
    direction === "up"
      ? "animate-partners-marquee-up motion-reduce:translate-y-0 motion-reduce:animate-none"
      : "animate-partners-marquee-down motion-reduce:translate-y-0 motion-reduce:animate-none";

  return (
    <div class="relative h-full min-h-0 min-w-0 flex-1 overflow-hidden">
      <div
        class={`flex flex-col gap-2 will-change-transform sm:gap-2.5 ${animClass}`}
        style={{ animationDuration: `${durationSec}s` }}
      >
        {track.map((item, i) => (
          <LogoCard key={`${item.altText}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
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
  const source = useMemo(() => normalizeSource(logos ?? []), [logos]);

  const columns = useMemo(
    () => splitIntoColumns(source, NUM_COLUMNS),
    [source],
  );

  const columnTracks = useMemo(
    () => columns.map((col) => buildSeamlessColumnTrack(col)),
    [columns],
  );

  const isExternal = Boolean(buttonHref?.startsWith("http"));

  const durations = [30, 34, 28, 36];

  return (
    <section class="box-border w-full max-h-[440px] overflow-hidden px-4 py-2">
      <div class="mx-auto max-h-[440px] max-w-7xl">
        <div class="flex max-h-[440px] min-h-0 flex-col overflow-hidden rounded-[24px] bg-[#E9F0F5] p-4 shadow-sm sm:rounded-[28px] sm:p-5 lg:flex-row lg:items-stretch lg:rounded-[32px] lg:p-6 lg:pb-6 lg:pl-6 lg:pr-2 lg:pt-6">
          <div class="mb-4 flex min-h-0 shrink-0 flex-col justify-center gap-3 lg:mb-0 lg:w-[40%] lg:max-w-md lg:gap-4 lg:pr-8">
            <h2 class="text-[22px] font-bold leading-[1.2] tracking-tight text-[#2d3748] sm:text-[24px] lg:text-[28px]">
              <span class="text-[#1e6ba8]">{titlePart1}</span>
              {titlePart1 && titlePart2 ? " " : null}
              <span class="text-[#2d3748]">{titlePart2}</span>
            </h2>
            <p class="line-clamp-3 text-[14px] leading-relaxed text-[#4a5568] sm:text-[15px] lg:line-clamp-4">
              {description}
            </p>
            <div>
              <a
                href={buttonHref || "#"}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                class="inline-flex items-center justify-center rounded-full bg-[#004D80] px-6 py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004D80] focus-visible:ring-offset-2 sm:px-7 sm:py-3 sm:text-[15px]"
              >
                {buttonText}
              </a>
            </div>
          </div>

          <div class="relative min-h-[160px] flex-1 min-w-0 overflow-hidden sm:min-h-[180px] lg:min-h-0">
            <div class="absolute inset-0 flex gap-2 sm:gap-2.5 lg:gap-3">
              {columnTracks.map((track, colIndex) => (
                <MarqueeColumn
                  key={colIndex}
                  track={track}
                  direction={colIndex % 2 === 0 ? "up" : "down"}
                  durationSec={durations[colIndex % durations.length]!}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

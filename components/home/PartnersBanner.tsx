import { useMemo } from "preact/hooks";
import type { ImageWidget } from "apps/admin/widgets.ts";
import PartnerLogoFrame from "../partners/PartnerLogoFrame.tsx";

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
   * @title URL do botão
   * @default /parceiros
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
const MIN_ITEMS_HORIZONTAL = 10;

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

function buildSeamlessHorizontalTrack(items: PartnerLogo[]): PartnerLogo[] {
  const base = items.length ? items : PLACEHOLDER_LOGOS;
  const expanded: PartnerLogo[] = [];
  let i = 0;
  while (expanded.length < MIN_ITEMS_HORIZONTAL) {
    expanded.push(base[i % base.length]!);
    i++;
  }
  return [...expanded, ...expanded];
}

function splitForTwoMobileRows(items: PartnerLogo[]): [PartnerLogo[], PartnerLogo[]] {
  const base = items.length ? items : PLACEHOLDER_LOGOS;
  const row0: PartnerLogo[] = [];
  const row1: PartnerLogo[] = [];
  base.forEach((item, i) => {
    (i % 2 === 0 ? row0 : row1).push(item);
  });
  if (row0.length === 0) row0.push(...base);
  if (row1.length === 0) row1.push(...base);
  return [row0, row1];
}

function LogoCard({ item, row }: { item: PartnerLogo; row?: boolean }) {
  if (row) {
    return (
      <div class="flex h-[60px] w-[74px] shrink-0 rounded-xl border border-black/[0.06] bg-white p-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <PartnerLogoFrame src={item.image} alt={item.altText || "Parceiro"} />
      </div>
    );
  }
  return (
    <div class="aspect-square w-full shrink-0 rounded-xl border border-black/[0.06] bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-3">
      <PartnerLogoFrame src={item.image} alt={item.altText || "Parceiro"} />
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

export default function PartnersBanner({
  titlePart1 = "+100 parceiros",
  titlePart2 = "confiam na Scarcom",
  description =
    "Empresas que contam com a Scarcom para manter seus ambientes de tecnologia sempre funcionando.",
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

  const [mobileRow0Source, mobileRow1Source] = useMemo(
    () => splitForTwoMobileRows(source),
    [source],
  );

  const horizontalTrack0 = useMemo(
    () => buildSeamlessHorizontalTrack(mobileRow0Source),
    [mobileRow0Source],
  );

  const horizontalTrack1 = useMemo(
    () => buildSeamlessHorizontalTrack(mobileRow1Source),
    [mobileRow1Source],
  );

  const isExternal = Boolean(buttonHref?.startsWith("http"));

  const durations = [30, 34, 28, 36];

  return (
    <section class="box-border w-full max-h-[440px] overflow-hidden px-4 py-2">
      <div class="mx-auto h-[440px] max-w-[1536px]">
        <div class="flex max-h-[440px] min-h-0 flex-col overflow-hidden rounded-[20px] bg-[#0153881A] lg:h-[440px] lg:pl-[80px] lg:pr-[59px] lg:py-0 shadow-sm sm:px-[14px] py-[42px] lg:flex-row lg:items-stretch">
          <div class="mb-[26px] flex min-h-0 shrink-0 flex-col justify-center gap-3 items-center sm:mb-[0] lg:mb-0 lg:w-[40%] lg:max-w-md lg:gap-4 lg:pr-8">
            <h2 class="text-[38px] font-bold leading-[44px] tracking-tight text-[#313438] text-center sm:text-[32px] lg:text-[38px]">
              <p class="text-[#015388]">{titlePart1}</p>
              {titlePart1 && titlePart2 ? " " : null}
              <p class="text-[#313438]">{titlePart2}</p>
            </h2>
            <p class="line-clamp-3 text-[14px] leading-relaxed text-[#4a5568] text-center sm:text-[14px] lg:line-clamp-4">
              {description}
            </p>
            <div>
              <a
                href={buttonHref || "#"}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                class="inline-flex items-center justify-center rounded-full bg-[#015388] px-[68px] py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004D80] focus-visible:ring-offset-2 sm:px-7 sm:py-3 sm:text-[14px]"
              >
                Ver mais parceiros
              </a>
            </div>
          </div>

          <div class="relative min-h-[160px] flex-1 min-w-0 overflow-hidden sm:min-h-[180px] lg:min-h-0">
            <div class="absolute inset-0 flex flex-col justify-center gap-2 overflow-hidden py-1 lg:hidden">
              <div class="relative min-h-0 shrink-0 overflow-hidden">
                <div
                  class="flex w-max flex-row gap-2 will-change-transform animate-partners-marquee-x-ltr motion-reduce:translate-x-0 motion-reduce:animate-none"
                  style={{ animationDuration: "36s" }}
                >
                  {horizontalTrack0.map((item, i) => (
                    <LogoCard key={`m0-${item.altText}-${i}`} item={item} row />
                  ))}
                </div>
              </div>
              <div class="relative min-h-0 shrink-0 overflow-hidden">
                <div
                  class="flex w-max flex-row gap-2 will-change-transform animate-partners-marquee-x-rtl motion-reduce:translate-x-0 motion-reduce:animate-none"
                  style={{ animationDuration: "40s" }}
                >
                  {horizontalTrack1.map((item, i) => (
                    <LogoCard key={`m1-${item.altText}-${i}`} item={item} row />
                  ))}
                </div>
              </div>
            </div>

            <div class="absolute inset-0 hidden gap-2 sm:gap-2.5 lg:flex lg:gap-3">
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

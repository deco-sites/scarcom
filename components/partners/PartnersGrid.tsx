import { useMemo } from "preact/hooks";
import { useSignal } from "@preact/signals";
import Image from "apps/website/components/Image.tsx";
import type { PartnerItem } from "./types.ts";

export interface Props {
  partners: PartnerItem[];
  allSegmentsLabel?: string;
  showingCountLabel?: string;
  initialVisibleCount?: number;
  loadMoreCount?: number;
  loadMoreButtonText?: string;
}

function normalizeSegment(segment: string) {
  return segment.trim().toLowerCase();
}

function buildSegmentFilters(partners: PartnerItem[]) {
  const map = new Map<string, { label: string; count: number }>();
  for (const partner of partners) {
    const key = normalizeSegment(partner.segment);
    if (!key) continue;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(key, { label: partner.segment.trim(), count: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label, "pt-BR")
  );
}

export default function PartnersGrid({
  partners,
  allSegmentsLabel = "Todos os segmentos",
  showingCountLabel = "Exibindo {count} empresas",
  initialVisibleCount = 30,
  loadMoreCount = 18,
  loadMoreButtonText = "Ver mais parceiros",
}: Props) {
  const selectedSegment = useSignal<string | null>(null);
  const visibleCount = useSignal(initialVisibleCount);

  const segmentFilters = useMemo(() => buildSegmentFilters(partners), [partners]);

  const filteredPartners = useMemo(() => {
    if (!selectedSegment.value) return partners;
    const key = normalizeSegment(selectedSegment.value);
    return partners.filter((p) => normalizeSegment(p.segment) === key);
  }, [partners, selectedSegment.value]);

  const displayedPartners = useMemo(
    () => filteredPartners.slice(0, visibleCount.value),
    [filteredPartners, visibleCount.value],
  );

  const hasMore = displayedPartners.length < filteredPartners.length;

  const showingLabel = showingCountLabel.replace(
    "{count}",
    String(filteredPartners.length),
  );

  const selectAll = () => {
    selectedSegment.value = null;
    visibleCount.value = initialVisibleCount;
  };

  const selectSegment = (label: string) => {
    selectedSegment.value = label;
    visibleCount.value = initialVisibleCount;
  };

  return (
    <div class="flex flex-col gap-6 lg:gap-8">
      <div class="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        <FilterButton
          active={selectedSegment.value === null}
          label={allSegmentsLabel}
          count={partners.length}
          onClick={selectAll}
        />
        {segmentFilters.map(({ label, count }) => (
          <FilterButton
            key={label}
            active={selectedSegment.value === label}
            label={label}
            count={count}
            onClick={() => selectSegment(label)}
          />
        ))}
      </div>

      <p class="text-[14px] text-[#6B7280]">{showingLabel}</p>

      {displayedPartners.length > 0
        ? (
          <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-4">
            {displayedPartners.map((partner, index) => (
              <li key={`${partner.alt}-${partner.segment}-${index}`}>
                <div class="flex aspect-[4/3] items-center justify-center rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                  <Image
                    src={partner.image}
                    alt={partner.alt || "Parceiro"}
                    width={200}
                    height={120}
                    class="max-h-full max-w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </li>
            ))}
          </ul>
        )
        : (
          <p class="py-12 text-center text-[15px] text-[#6B7280]">
            Nenhum parceiro encontrado para este segmento.
          </p>
        )}

      {hasMore && (
        <div class="flex justify-center pt-2">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-full bg-[#015388] px-8 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#015388] focus-visible:ring-offset-2"
            onClick={() => {
              visibleCount.value = Math.min(
                visibleCount.value + loadMoreCount,
                filteredPartners.length,
              );
            }}
          >
            {loadMoreButtonText}
          </button>
        </div>
      )}
    </div>
  );
}

function FilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      class={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors sm:text-[14px] ${
        active
          ? "border-[#015388] bg-[#015388] text-white"
          : "border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[#015388]/40"
      }`}
    >
      <span>{label}</span>
      <span
        class={`inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[12px] font-semibold ${
          active ? "bg-white/20 text-white" : "bg-[#F3F4F6] text-[#6B7280]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

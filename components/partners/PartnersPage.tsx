import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import PartnersGrid from "../../islands/PartnersGrid.tsx";
import type { PartnerItem, StatItem } from "./types.ts";

export type { PartnerItem, StatItem };

const PLACEHOLDER_IMAGE =
  "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/fe7cd8ba-c954-45d6-9282-ee7d8ca8e3c7";

const DEFAULT_STATS: StatItem[] = [
  { value: "125+", label: "Parceiros Ativos" },
  { value: "+6", label: "Segmentos" },
  { value: "15", label: "Anos de Experiência" },
  { value: "98%", label: "Satisfação" },
];

const DEFAULT_PARTNERS: PartnerItem[] = [
  { image: PLACEHOLDER_IMAGE, alt: "KIA", segment: "Tecnologia" },
  { image: PLACEHOLDER_IMAGE, alt: "FIESP", segment: "Indústria" },
  { image: PLACEHOLDER_IMAGE, alt: "Senac", segment: "Serviços" },
  { image: PLACEHOLDER_IMAGE, alt: "SENAI", segment: "Indústria" },
  { image: PLACEHOLDER_IMAGE, alt: "GREE", segment: "Tecnologia" },
  { image: PLACEHOLDER_IMAGE, alt: "Webmotors", segment: "Varejo" },
];

export interface Props {
  /** @title Estatísticas (barra superior) */
  stats?: StatItem[];
  /**
   * @title Ícone ao lado do título
   */
  headerIcon?: ImageWidget;
  /**
   * @title Título
   * @default Empresas que confiam na Scarcom
   */
  title?: string;
  /**
   * @title Subtítulo
   * @format textarea
   */
  subtitle?: string;
  /**
   * @title Rótulo do filtro "todos"
   * @default Todos os segmentos
   */
  allSegmentsLabel?: string;
  /**
   * @title Texto de contagem — use {count}
   * @default Exibindo {count} empresas
   */
  showingCountLabel?: string;
  /** @title Parceiros (logo + segmento) */
  partners?: PartnerItem[];
  /**
   * @title Logos visíveis inicialmente
   * @default 30
   */
  initialVisibleCount?: number;
  /**
   * @title Logos ao carregar mais
   * @default 18
   */
  loadMoreCount?: number;
  /**
   * @title Texto do botão carregar mais
   * @default Ver mais parceiros
   */
  loadMoreButtonText?: string;
  /**
   * @title Sobre — rótulo superior
   * @default Sobre Nossas Parcerias
   */
  aboutEyebrow?: string;
  /**
   * @title Sobre — título
   * @default Parceiros e Marcas da Scarcom
   */
  aboutTitle?: string;
  /**
   * @title Sobre — conteúdo
   * @format rich-text
   */
  aboutContent?: HTMLWidget;
}

export default function PartnersPage({
  stats = DEFAULT_STATS,
  headerIcon,
  title = "Empresas que confiam na Scarcom",
  subtitle =
    "Trabalhamos com as principais marcas do mercado, oferecendo soluções integradas em tecnologia, comunicação e inovação.",
  allSegmentsLabel = "Todos os segmentos",
  showingCountLabel = "Exibindo {count} empresas",
  partners = DEFAULT_PARTNERS,
  initialVisibleCount = 30,
  loadMoreCount = 18,
  loadMoreButtonText = "Ver mais parceiros",
  aboutEyebrow = "Sobre Nossas Parcerias",
  aboutTitle = "Parceiros e Marcas da Scarcom",
  aboutContent =
    "<p>A Scarcom mantém parcerias estratégicas com as marcas líderes do mercado brasileiro e internacional, consolidando sua posição como referência em soluções tecnológicas e inovação empresarial.</p><p>Através da integração de sistemas avançados e do trabalho conjunto com parceiros estratégicos, a Scarcom desenvolve soluções personalizadas que impulsionam a transformação digital das empresas.</p>",
}: Props) {
  const list = partners?.length ? partners : DEFAULT_PARTNERS;

  return (
    <div class="w-full bg-white">
      <div class="mx-auto max-w-[1536px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Barra de estatísticas */}
        <ul class="mb-10 grid grid-cols-2 gap-3 rounded-2xl bg-[#015388] px-4 py-6 sm:grid-cols-4 sm:gap-0 sm:px-8 sm:py-8 lg:rounded-[20px] lg:px-12">
          {stats.map((stat) => (
            <li
              key={stat.label}
              class="flex flex-col items-center justify-center gap-1 text-center sm:border-r sm:border-white/20 sm:last:border-r-0"
            >
              <span class="text-[28px] font-bold leading-none text-white sm:text-[32px] lg:text-[36px]">
                {stat.value}
              </span>
              <span class="text-[12px] font-medium text-white/90 sm:text-[13px] lg:text-[14px]">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>

        {/* Cabeçalho */}
        <header class="mb-8 flex flex-col gap-3 lg:mb-10">
          <div class="flex items-start gap-3">
            {headerIcon
              ? (
                <Image
                  src={headerIcon}
                  alt=""
                  width={32}
                  height={32}
                  class="mt-1 h-8 w-8 shrink-0 object-contain"
                />
              )
              : (
                <span
                  class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center text-[#015388]"
                  aria-hidden
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2l1.8 5.4L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.6L12 2zm8 14l.9 2.7 2.7.9-2.7.9-.9 2.7-.9-2.7-2.7-.9 2.7-.9.9-2.7 2.7-.9-2.7-.9L20 16zM4 14l.6 1.8L6.4 16l-1.8.6L4 18.4l-.6-1.8L1.6 16l1.8-.6L4 14z" />
                  </svg>
                </span>
              )}
            <h1 class="text-[24px] font-bold leading-tight text-[#015388] sm:text-[28px] lg:text-[32px]">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p class="max-w-3xl text-[14px] leading-relaxed text-[#6B7280] sm:text-[15px] lg:pl-11">
              {subtitle}
            </p>
          )}
        </header>

        {/* Filtros + grade (island) */}
        <PartnersGrid
          partners={list}
          allSegmentsLabel={allSegmentsLabel}
          showingCountLabel={showingCountLabel}
          initialVisibleCount={initialVisibleCount}
          loadMoreCount={loadMoreCount}
          loadMoreButtonText={loadMoreButtonText}
        />
      </div>

      {/* Sobre */}
      {(aboutEyebrow || aboutTitle || aboutContent) && (
        <section class="border-t border-[#E5E7EB] bg-[#F9FAFB]">
          <div class="mx-auto max-w-[1536px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            {aboutEyebrow && (
              <p class="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[#015388]">
                {aboutEyebrow}
              </p>
            )}
            {aboutTitle && (
              <h2 class="mb-6 text-[22px] font-bold text-[#313438] sm:text-[26px] lg:text-[28px]">
                {aboutTitle}
              </h2>
            )}
            {aboutContent && (
              <div
                class="prose prose-sm max-w-none text-[14px] leading-relaxed text-[#4B5563] sm:text-[15px] [&_p]:mb-4 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: aboutContent }}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
}

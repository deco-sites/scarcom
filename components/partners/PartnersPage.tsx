import PartnersGrid from "../../islands/PartnersGrid.tsx";
import type { PartnerItem } from "./types.ts";

export type { PartnerItem };

const PLACEHOLDER_IMAGE =
  "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/fe7cd8ba-c954-45d6-9282-ee7d8ca8e3c7";

const STATS = [
  { value: "125+", label: "Parceiros Ativos" },
  { value: "+6", label: "Segmentos" },
  { value: "15", label: "Anos de Experiência" },
  { value: "98%", label: "Satisfação" },
] as const;

const PAGE_TITLE = "Empresas que confiam na Scarcom";
const PAGE_SUBTITLE =
  "Trabalhamos com as principais marcas do mercado, oferecendo soluções integradas em tecnologia, comunicação e inovação.";

const ABOUT_EYEBROW = "Sobre Nossas Parcerias";
const ABOUT_TITLE = "Parceiros e Marcas da Scarcom";
const ABOUT_CONTENT = `
  <p>A Scarcom mantém parcerias estratégicas com as marcas líderes do mercado brasileiro e internacional, consolidando sua posição como referência em soluções tecnológicas e inovação empresarial. Nossa rede de parceiros abrange diferentes segmentos, desde tecnologia e varejo até indústria, saúde e serviços especializados. Essa diversidade nos permite oferecer uma integração de sistemas robusta e eficiente, atendendo às demandas específicas de cada setor com excelência e comprometimento. Trabalhamos constantemente para expandir nossa base de colaboradores e fortalecer relacionamentos duradouros que beneficiem nossos clientes.</p>
  <p>Através da integração de sistemas avançados e do trabalho conjunto com parceiros estratégicos, a Scarcom desenvolve soluções personalizadas que impulsionam a transformação digital das empresas. Nossa expertise em tecnologia, combinada com o conhecimento profundo dos nossos parceiros, permite criar ecossistemas de negócios integrados, escaláveis e preparados para os desafios do futuro. Cada parceria é cuidadosamente selecionada para garantir alinhamento de valores, qualidade de entrega e inovação contínua. Acreditamos que a colaboração com marcas líderes é fundamental para oferecer as melhores soluções tecnológicas aos nossos clientes.</p>
`;

const DEFAULT_PARTNERS: PartnerItem[] = [
  { image: PLACEHOLDER_IMAGE, alt: "KIA", segment: "Tecnologia" },
  { image: PLACEHOLDER_IMAGE, alt: "FIESP", segment: "Indústria" },
  { image: PLACEHOLDER_IMAGE, alt: "Senac", segment: "Serviços" },
  { image: PLACEHOLDER_IMAGE, alt: "SENAI", segment: "Indústria" },
  { image: PLACEHOLDER_IMAGE, alt: "GREE", segment: "Tecnologia" },
  { image: PLACEHOLDER_IMAGE, alt: "Webmotors", segment: "Varejo" },
];

export interface Props {
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
}

export default function PartnersPage({
  allSegmentsLabel = "Todos os segmentos",
  showingCountLabel = "Exibindo {count} empresas",
  partners = DEFAULT_PARTNERS,
  initialVisibleCount = 30,
  loadMoreCount = 18,
  loadMoreButtonText = "Ver mais parceiros",
}: Props) {
  const list = partners?.length ? partners : DEFAULT_PARTNERS;

  return (
    <div class="w-full bg-white">
      <div class="mx-auto max-w-[1536px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <ul class="mb-10 grid grid-cols-2 gap-3 rounded-2xl bg-[#015388] px-4 py-6 sm:grid-cols-4 sm:gap-0 sm:px-8 sm:py-8 lg:rounded-[20px] lg:px-12">
          {STATS.map((stat) => (
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

        <header class="mb-8 flex flex-col gap-3 lg:mb-10">
          <div class="flex items-start gap-3">
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
            <h1 class="text-[24px] font-bold leading-tight text-[#015388] sm:text-[28px] lg:text-[32px]">
              {PAGE_TITLE}
            </h1>
          </div>
          <p class="max-w-3xl text-[14px] leading-relaxed text-[#6B7280] sm:text-[15px] lg:pl-11">
            {PAGE_SUBTITLE}
          </p>
        </header>

        <PartnersGrid
          partners={list}
          allSegmentsLabel={allSegmentsLabel}
          showingCountLabel={showingCountLabel}
          initialVisibleCount={initialVisibleCount}
          loadMoreCount={loadMoreCount}
          loadMoreButtonText={loadMoreButtonText}
        />
      </div>

      <section class="border-t border-[#E5E7EB] bg-[#F9FAFB]">
        <div class="mx-auto max-w-[1536px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p class="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[#015388]">
            {ABOUT_EYEBROW}
          </p>
          <h2 class="mb-6 text-[22px] font-bold text-[#313438] sm:text-[26px] lg:text-[28px]">
            {ABOUT_TITLE}
          </h2>
          <div
            class="prose prose-sm max-w-none text-[14px] leading-relaxed text-[#4B5563] sm:text-[15px] [&_p]:mb-4 [&_p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: ABOUT_CONTENT }}
          />
        </div>
      </section>
    </div>
  );
}

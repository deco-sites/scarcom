import PartnersGrid from "../../islands/PartnersGrid.tsx";
import type { PartnerItem } from "./types.ts";

export type { PartnerItem };

const PLACEHOLDER_IMAGE =
  "https://decoims.com/scarcom/c92f9fe3-acb3-4e6f-84c4-40ecff114a5e/fe7cd8ba-c954-45d6-9282-ee7d8ca8e3c7.svg";

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
}

export default function PartnersPage({
  allSegmentsLabel = "Todos os segmentos",
  showingCountLabel = "Exibindo {count} empresas",
  partners = DEFAULT_PARTNERS,
  initialVisibleCount = 30,
  loadMoreCount = 18,
}: Props) {
  const list = partners?.length ? partners : DEFAULT_PARTNERS;

  return (
    <div class="w-full bg-white">
      <div class="mx-auto max-w-[1536px] bg-[#F9FAFB] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <ul class="mb-8 grid grid-cols-2 gap-3 rounded-2xl bg-gradient-to-r from-[#133449] to-[#015388]  px-4 py-6 sm:grid-cols-4 sm:gap-0 sm:px-8 sm:py-8 lg:px-12">
          {STATS.map((stat) => (
            <li
              key={stat.label}
              class="flex flex-col items-center justify-center gap-1 text-center"
            >
              <span class="text-3xl font-bold leading-none text-white">
                {stat.value}
              </span>
              <span class="text-[14px] font-medium text-[#DBEAFE]">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>

        <header class="mb-8 flex flex-col gap-4">
          <div class="flex items-start gap-3 flex-col lg:flex-row">
            <span
              class="flex h-10 w-10 rounded-[10px] bg-[#01538833] items-center justify-center text-[#133449]"
              aria-hidden
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.93694 15.5C9.84766 15.1539 9.66728 14.8381 9.41456 14.5854C9.16184 14.3327 8.84601 14.1523 8.49994 14.063L2.36494 12.481C2.26027 12.4513 2.16815 12.3883 2.10255 12.3014C2.03696 12.2146 2.00146 12.1088 2.00146 12C2.00146 11.8912 2.03696 11.7854 2.10255 11.6986C2.16815 11.6118 2.26027 11.5487 2.36494 11.519L8.49994 9.93601C8.84589 9.84681 9.16163 9.66658 9.41434 9.41404C9.66705 9.16151 9.84751 8.84589 9.93694 8.50001L11.5189 2.36501C11.5483 2.25992 11.6113 2.16735 11.6983 2.1014C11.7852 2.03545 11.8913 1.99976 12.0004 1.99976C12.1096 1.99976 12.2157 2.03545 12.3026 2.1014C12.3896 2.16735 12.4525 2.25992 12.4819 2.36501L14.0629 8.50001C14.1522 8.84608 14.3326 9.1619 14.5853 9.41462C14.838 9.66734 15.1539 9.84773 15.4999 9.93701L21.6349 11.518C21.7404 11.5471 21.8335 11.61 21.8998 11.6971C21.9661 11.7841 22.002 11.8906 22.002 12C22.002 12.1094 21.9661 12.2159 21.8998 12.3029C21.8335 12.39 21.7404 12.4529 21.6349 12.482L15.4999 14.063C15.1539 14.1523 14.838 14.3327 14.5853 14.5854C14.3326 14.8381 14.1522 15.1539 14.0629 15.5L12.4809 21.635C12.4515 21.7401 12.3886 21.8327 12.3016 21.8986C12.2147 21.9646 12.1086 22.0003 11.9994 22.0003C11.8903 22.0003 11.7842 21.9646 11.6973 21.8986C11.6103 21.8327 11.5473 21.7401 11.5179 21.635L9.93694 15.5Z" stroke="#133449" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 3V7" stroke="#133449" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 5H18" stroke="#133449" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 17V19" stroke="#133449" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 18H3" stroke="#133449" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <h1 class="text-[22px] font-bold leading-[100%] text-[#133449] sm:text-[22px] lg:text-3xl">
              {PAGE_TITLE}
            </h1>
          </div>
          <p class="text-[14px] leading-[165%] text-[#133449] sm:text-[14px] lg:text-base">
            {PAGE_SUBTITLE}
          </p>
        </header>

        <PartnersGrid
          partners={list}
          allSegmentsLabel={allSegmentsLabel}
          showingCountLabel={showingCountLabel}
          initialVisibleCount={initialVisibleCount}
          loadMoreCount={loadMoreCount}
        />
      </div>

      <section>
        <div class="mx-auto max-w-[1536px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p class="w-fit px-4 py-2 mb-4 text-sm font-semibold tracking-wide text-[#133449] bg-[#EFF6FF] rounded-full">
            {ABOUT_EYEBROW}
          </p>
          <h2 class="mb-8 text-2xl font-bold text-[#111827] sm:text-2xl lg:text-3xl">
            {ABOUT_TITLE}
          </h2>
          <div
            class="prose prose-sm max-w-none text-sm leading-relaxed text-[#6B7280] [&_p]:mb-4 [&_p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: ABOUT_CONTENT }}
          />
        </div>
      </section>
    </div>
  );
}

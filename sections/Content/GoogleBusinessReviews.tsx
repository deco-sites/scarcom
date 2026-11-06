import type { SectionProps } from "@deco/deco";
import GoogleBusinessReviewsIsland, {
  type ReviewItem,
} from "../../islands/GoogleBusinessReviews.tsx";
import {
  fetchGoogleBusinessReviews,
  getCachedReviews,
  getGoogleBusinessAccessToken,
  type GoogleReview,
  starRatingToNumber,
} from "../../utils/googleBusinessProfileReviews.ts";

export type ApiSortOrder =
  | "default"
  | "updateTime_desc";

export interface Props {
  /**
   * @title Título
   */
  title?: string;
  /**
   * @title Descrição
   */
  description?: string;
  /**
   * @title Alinhamento do título
   */
  headerAlignment?: "center" | "left";
  /**
   * @title Nome da localização (API)
   * @description Caminho completo, ex: accounts/123456789/locations/987654321. Preferir variável GOOGLE_BUSINESS_LOCATION_NAME no Deco.
   */
  locationName?: string;
  /**
   * @title Máximo de avaliações (máx. 50)
   * @default 50
   */
  maxReviews?: number;
  /**
   * @title TTL do cache (segundos)
   * @description Reduz chamadas à API Google. Padrão 3600 (1h).
   * @default 3600
   */
  cacheTtlSeconds?: number;
  /**
   * @title Ordenação na API (primeira página)
   * @description A API só suporta rating, rating desc ou updateTime desc. Ordenação fina (datas ascendente, etc.) é feita no site.
   */
  apiListOrderBy?: ApiSortOrder;
  /**
   * @title Mostrar carrossel a partir de N itens
   * @default 3
   */
  carouselMinItems?: number;
  /**
   * @title Ocultar seção sem dados
   * @default true
   */
  hideWhenEmpty?: boolean;
  /**
   * @title URL — ver todas no Google
   * @description Link para o perfil/maps (abre em nova aba). Pode usar GOOGLE_BUSINESS_PUBLIC_REVIEWS_URL no env.
   */
  googleReviewsUrl?: string;
  /**
   * @title Mostrar botão “ver todas”
   * @default true
   */
  showCta?: boolean;
  /**
   * @title Texto do botão CTA
   */
  ctaLabel?: string;
  /**
   * @title Largura do card no carrossel (px)
   * @default 292
   */
  carouselItemWidth?: number;
}

function mapReviewToItem(r: GoogleReview, index: number): ReviewItem {
  const stars = starRatingToNumber(
    typeof r.starRating === "string" ? r.starRating : "",
  );
  const displayName = r.reviewer?.isAnonymous
    ? "Cliente Google"
    : (r.reviewer?.displayName ?? "Cliente Google");
  return {
    reviewId: r.reviewId ?? r.name ?? `idx-${index}`,
    authorName: displayName,
    rating: stars,
    comment: r.comment ?? "",
    createTime: r.createTime ?? "",
    updateTime: r.updateTime ?? "",
    profilePhotoUrl: r.reviewer?.isAnonymous
      ? undefined
      : r.reviewer?.profilePhotoUrl,
  };
}

function apiOrderByParam(
  apiSort: ApiSortOrder | undefined,
): string | undefined {
  if (apiSort === "updateTime_desc") {
    return "updateTime desc";
  }
  return undefined;
}

function resolvePublicReviewsUrl(props: Props): string {
  return (props.googleReviewsUrl?.trim() ||
    Deno.env.get("GOOGLE_BUSINESS_PUBLIC_REVIEWS_URL")?.trim()) ?? "";
}

export async function loader(
  props: Props,
  _req: Request,
): Promise<
  Props & {
    reviews: ReviewItem[];
    averageRating?: number;
    totalReviewCount?: number;
    loadError?: string;
    googleReviewsUrl?: string;
  }
> {
  const {
    locationName: locationProp,
    maxReviews = 50,
    cacheTtlSeconds = 3600,
    apiListOrderBy = "default",
    hideWhenEmpty = true,
  } = props;

  const locationName = (typeof locationProp === "string" && locationProp.trim())
    ? locationProp.trim()
    : Deno.env.get("GOOGLE_BUSINESS_LOCATION_NAME")?.trim();

  const publicReviewsUrlEarly = resolvePublicReviewsUrl(props);

  if (!locationName) {
    return {
      ...props,
      reviews: [],
      googleReviewsUrl: publicReviewsUrlEarly,
      loadError: hideWhenEmpty
        ? undefined
        : "Configure o nome da localização (CMS ou GOOGLE_BUSINESS_LOCATION_NAME).",
    };
  }

  const accessToken = await getGoogleBusinessAccessToken();
  if (!accessToken) {
    const msg =
      "Credenciais Google ausentes (GOOGLE_BUSINESS_ACCESS_TOKEN ou refresh client id/secret).";
    return {
      ...props,
      reviews: [],
      googleReviewsUrl: publicReviewsUrlEarly,
      loadError: hideWhenEmpty ? undefined : msg,
    };
  }

  const orderBy = apiOrderByParam(apiListOrderBy);
  const cacheKey = `gbp-reviews:${locationName}:${Math.min(maxReviews, 50)}:${
    orderBy ?? "default"
  }`;

  try {
    const data = await getCachedReviews(
      cacheKey,
      Math.max(60, cacheTtlSeconds),
      async () => {
        return await fetchGoogleBusinessReviews({
          locationName,
          orderBy,
          maxReviews: Math.min(50, maxReviews),
          accessToken,
        });
      },
    );

    const reviews = (data.reviews ?? []).map(mapReviewToItem);
    const publicReviewsUrl = resolvePublicReviewsUrl(props);

    return {
      ...props,
      reviews,
      averageRating: data.averageRating,
      totalReviewCount: data.totalReviewCount,
      googleReviewsUrl: publicReviewsUrl,
    };
  } catch (e) {
    console.error("GoogleBusinessReviews loader:", e);
    return {
      ...props,
      reviews: [],
      googleReviewsUrl: resolvePublicReviewsUrl(props),
      loadError: hideWhenEmpty
        ? undefined
        : (e instanceof Error ? e.message : "Erro ao carregar avaliações."),
    };
  }
}

export default function GoogleBusinessReviews(
  {
    title,
    description,
    headerAlignment = "center",
    reviews,
    averageRating,
    totalReviewCount,
    carouselMinItems = 3,
    carouselItemWidth = 292,
    loadError,
    hideWhenEmpty = true,
    googleReviewsUrl,
    showCta = true,
    ctaLabel,
  }: SectionProps<typeof loader>,
) {
  const list = reviews ?? [];
  if (list.length === 0 && hideWhenEmpty) {
    return null;
  }

  const headAlign = headerAlignment === "left"
    ? "text-left items-start"
    : "text-center items-center";

  return (
    <div class="w-full container px-4 py-8 lg:py-10 lg:px-0">
      <div class="flex flex-col gap-8 lg:gap-10">
        {(title || description) && (
          <div class={`flex flex-col gap-3 ${headAlign}`}>
            {title && (
              <h2 class="text-2xl lg:text-3xl font-bold uppercase tracking-wide text-primary">
                {title}
              </h2>
            )}
            {description && (
              <p
                class={`text-base lg:text-lg text-base-content/90 max-w-3xl font-normal leading-relaxed ${
                  headerAlignment === "left" ? "" : "mx-auto"
                }`}
              >
                {description}
              </p>
            )}
          </div>
        )}
        <GoogleBusinessReviewsIsland
          reviews={list}
          averageRating={averageRating}
          totalReviewCount={totalReviewCount}
          carouselMinItems={carouselMinItems}
          carouselItemWidth={carouselItemWidth}
          errorMessage={list.length === 0 ? loadError : undefined}
          googleReviewsUrl={googleReviewsUrl}
          showCta={showCta && Boolean(googleReviewsUrl?.trim())}
          ctaLabel={ctaLabel}
        />
      </div>
    </div>
  );
}

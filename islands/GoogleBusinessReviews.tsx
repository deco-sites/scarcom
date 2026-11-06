import Carousel from "../components/layout/Carousel.tsx";
import Icon from "../components/ui/Icon.tsx";
import ReviewerAvatar from "./ReviewerAvatar.tsx";
import { useMemo, useState } from "preact/hooks";

export interface ReviewItem {
  reviewId: string;
  authorName: string;
  rating: number;
  comment: string;
  createTime: string;
  updateTime: string;
  profilePhotoUrl?: string;
}

export type SortMode =
  | "date_desc"
  | "date_asc"
  | "rating_desc"
  | "rating_asc";

export interface Props {
  reviews: ReviewItem[];
  averageRating?: number;
  totalReviewCount?: number;
  /** When reviews.length >= this, use carousel layout */
  carouselMinItems?: number;
  errorMessage?: string;
  /** Card width in px (carousel); ~280–320 matches ~4 cards on desktop */
  carouselItemWidth?: number;
  /** Link to Google Maps / Business profile for “see all reviews” */
  googleReviewsUrl?: string;
  /** @default true */
  showCta?: boolean;
  ctaLabel?: string;
}

function formatPtRelative(isoDate: string): string {
  const t = new Date(isoDate).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const h = Math.floor(min / 60);
  const d = Math.floor(h / 24);
  const w = Math.floor(d / 7);
  const mo = Math.floor(d / 30);
  const y = Math.floor(d / 365);
  if (y >= 1) return y === 1 ? "há 1 ano" : `há ${y} anos`;
  if (mo >= 1) return mo === 1 ? "há 1 mês" : `há ${mo} meses`;
  if (w >= 1) return w === 1 ? "há 1 semana" : `há ${w} semanas`;
  if (d >= 1) return d === 1 ? "há 1 dia" : `há ${d} dias`;
  if (h >= 1) return h === 1 ? "há 1 hora" : `há ${h} horas`;
  if (min >= 1) return min === 1 ? "há 1 minuto" : `há ${min} minutos`;
  return "agora";
}

function StarRow(
  { rating, size = "md" }: { rating: number; size?: "sm" | "md" },
) {
  const full = Math.round(Math.min(5, Math.max(0, rating)));
  const starClass = size === "sm" ? "text-sm" : "text-lg";
  return (
    <div
      class={`flex gap-0.5 ${starClass}`}
      aria-label={`${rating} de 5 estrelas`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          class={i < full ? "text-warning" : "text-base-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function GoogleGMark({ class: className }: { class?: string }) {
  return (
    <svg
      class={className ?? "w-7 h-7"}
      viewBox="0 0 48 48"
      aria-hidden
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.653 32.657 29.083 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.08 0-9.63-3.329-11.283-8.091l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.086 5.571l.003-.002 6.19 5.238C36.972 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

function ReviewCard({ item }: { item: ReviewItem }) {
  const relative = item.createTime ? formatPtRelative(item.createTime) : "";
  const initial = (item.authorName || "?").slice(0, 1).toUpperCase();
  const author = item.authorName || "Cliente Google";
  return (
    <article
      class="bg-base-100 border border-base-200 rounded-lg shadow-sm p-4 h-full flex flex-col gap-3 min-w-[260px] max-w-full"
      aria-label={`Avaliação de ${author}`}
    >
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-3 min-w-0">
          <ReviewerAvatar
            photoUrl={item.profilePhotoUrl}
            initial={initial}
          />
          <span class="font-semibold text-base-content truncate">{author}</span>
        </div>
        <GoogleGMark class="shrink-0 w-6 h-6 opacity-90" />
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <StarRow rating={item.rating} size="sm" />
        {relative && (
          <span class="text-xs text-base-content/50">{relative}</span>
        )}
      </div>
      <p class="text-sm text-base-content/90 whitespace-pre-wrap break-words line-clamp-4 grow leading-relaxed">
        {item.comment || "—"}
      </p>
    </article>
  );
}

export default function GoogleBusinessReviewsIsland({
  reviews,
  averageRating,
  totalReviewCount,
  carouselMinItems = 3,
  carouselItemWidth = 292,
  errorMessage,
  googleReviewsUrl,
  showCta = true,
  ctaLabel = "Ver todas as avaliações no Google",
}: Props) {
  const [sort, setSort] = useState<SortMode>("date_desc");

  const sorted = useMemo(() => {
    const list = [...reviews];
    const byRating = (a: ReviewItem, b: ReviewItem) => a.rating - b.rating;
    const byDate = (a: ReviewItem, b: ReviewItem) =>
      new Date(a.createTime).getTime() - new Date(b.createTime).getTime();

    switch (sort) {
      case "rating_asc":
        return list.sort(byRating);
      case "rating_desc":
        return list.sort((a, b) => byRating(b, a));
      case "date_asc":
        return list.sort(byDate);
      case "date_desc":
      default:
        return list.sort((a, b) => byDate(b, a));
    }
  }, [reviews, sort]);

  if (errorMessage) {
    return (
      <div class="rounded-lg bg-base-200 p-4 text-sm text-base-content/80">
        {errorMessage}
      </div>
    );
  }

  if (!sorted.length) {
    return null;
  }

  const useCarousel = sorted.length >= (carouselMinItems ?? 3);
  const ratingStr =
    typeof averageRating === "number" && !Number.isNaN(averageRating)
      ? averageRating.toFixed(1).replace(".", ",")
      : null;

  return (
    <div class="flex flex-col gap-8 w-full">
      {(ratingStr != null && typeof totalReviewCount === "number") && (
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-6 py-2 border-y border-base-200"
          aria-labelledby="google-reviews-summary-heading"
        >
          <h3 id="google-reviews-summary-heading" class="sr-only">
            Resumo das avaliações no Google: {ratingStr} em 5 estrelas,{" "}
            {totalReviewCount}{" "}
            {totalReviewCount === 1 ? "avaliação" : "avaliações"}
          </h3>
          <GoogleGMark class="w-10 h-10 sm:w-12 sm:h-12 shrink-0 mx-auto sm:mx-0" />
          <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span class="text-4xl sm:text-5xl font-bold text-base-content tabular-nums">
              {ratingStr}
            </span>
            <StarRow rating={averageRating!} />
            <span
              class="hidden sm:block w-px h-10 bg-base-300 shrink-0"
              aria-hidden
            />
            <p class="text-sm sm:text-base text-base-content/80 text-center sm:text-left">
              <span class="font-semibold text-base-content">
                {totalReviewCount}
              </span>{" "}
              {totalReviewCount === 1
                ? "Avaliação no Google"
                : "Avaliações no Google"}
            </p>
          </div>
        </div>
      )}

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
        <label
          for="google-reviews-sort"
          class="flex items-center gap-2 text-sm w-full sm:w-auto justify-center sm:justify-end"
        >
          <span
            class="text-base-content/60 whitespace-nowrap"
            id="google-reviews-sort-label"
          >
            Ordenar por
          </span>
          <select
            id="google-reviews-sort"
            class="select select-bordered select-sm max-w-[220px] bg-base-100 border-base-300 rounded-lg"
            value={sort}
            aria-labelledby="google-reviews-sort-label"
            onChange={(e) =>
              setSort((e.target as HTMLSelectElement).value as SortMode)}
          >
            <option value="date_desc">Mais recentes</option>
            <option value="date_asc">Mais antigas</option>
            <option value="rating_desc">Maior nota</option>
            <option value="rating_asc">Menor nota</option>
          </select>
        </label>
      </div>

      {useCarousel
        ? (
          <Carousel
            interval={0}
            layout={{
              itemWidth: carouselItemWidth,
              gap: { mobile: "4", desktop: "4" },
            }}
          >
            {sorted.map((item) => (
              <ReviewCard
                key={item.reviewId}
                item={item}
              />
            ))}
          </Carousel>
        )
        : (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((item) => (
              <ReviewCard
                key={item.reviewId}
                item={item}
              />
            ))}
          </div>
        )}

      {showCta && googleReviewsUrl && (
        <div class="flex justify-center pt-2">
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary btn-sm sm:btn-md gap-2 px-8 rounded-lg normal-case font-medium"
            aria-label={`${ctaLabel} (abre numa nova separador)`}
          >
            {ctaLabel}
            <Icon id="ArrowsPointingOut" size={18} strokeWidth={2} />
          </a>
        </div>
      )}
    </div>
  );
}

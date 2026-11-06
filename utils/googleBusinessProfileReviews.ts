/**
 * Google Business Profile API v4 — list reviews + minimal token helper.
 * @see https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list
 */

const MYBUSINESS_BASE = "https://mybusiness.googleapis.com/v4";

export type StarRatingEnum =
  | "STAR_RATING_UNSPECIFIED"
  | "ONE"
  | "TWO"
  | "THREE"
  | "FOUR"
  | "FIVE";

export interface GoogleReview {
  name?: string;
  reviewId?: string;
  reviewer?: {
    displayName?: string;
    isAnonymous?: boolean;
    profilePhotoUrl?: string;
  };
  starRating?: StarRatingEnum | string;
  comment?: string;
  createTime?: string;
  updateTime?: string;
}

export interface ListReviewsResponse {
  reviews?: GoogleReview[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
}

const STAR_MAP: Record<string, number> = {
  STAR_RATING_UNSPECIFIED: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

export function starRatingToNumber(starRating?: string): number {
  if (!starRating) return 0;
  return STAR_MAP[starRating] ?? 0;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

/**
 * Resolve OAuth2 access token from env:
 * - GOOGLE_BUSINESS_ACCESS_TOKEN: used as-is if set
 * - else GOOGLE_BUSINESS_REFRESH_TOKEN + GOOGLE_BUSINESS_CLIENT_ID + GOOGLE_BUSINESS_CLIENT_SECRET
 */
export async function getGoogleBusinessAccessToken(): Promise<string | null> {
  const direct = Deno.env.get("GOOGLE_BUSINESS_ACCESS_TOKEN")?.trim();
  if (direct) return direct;

  const refreshToken = Deno.env.get("GOOGLE_BUSINESS_REFRESH_TOKEN")?.trim();
  const clientId = Deno.env.get("GOOGLE_BUSINESS_CLIENT_ID")?.trim();
  const clientSecret = Deno.env.get("GOOGLE_BUSINESS_CLIENT_SECRET")?.trim();

  if (!refreshToken || !clientId || !clientSecret) {
    return null;
  }

  const now = Date.now();
  if (
    cachedAccessToken &&
    cachedAccessToken.expiresAt > now + 60_000
  ) {
    return cachedAccessToken.token;
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    console.error(
      "Google OAuth token refresh failed:",
      res.status,
      await res.text(),
    );
    return null;
  }

  const json = (await res.json()) as TokenResponse;
  if (!json.access_token) return null;

  const ttlMs = (json.expires_in ?? 3600) * 1000;
  cachedAccessToken = {
    token: json.access_token,
    expiresAt: now + ttlMs,
  };

  return json.access_token;
}

export interface FetchReviewsOptions {
  /** Full resource path, e.g. accounts/123/locations/456 */
  locationName: string;
  /** API list orderBy: rating | rating desc | updateTime desc (default server behavior if omitted) */
  orderBy?: string;
  maxReviews?: number;
  accessToken: string;
}

export async function fetchGoogleBusinessReviews(
  options: FetchReviewsOptions,
): Promise<ListReviewsResponse & { reviewsNormalized: number }> {
  const { locationName, orderBy, maxReviews = 50, accessToken } = options;

  const parent = locationName.startsWith("accounts/")
    ? locationName
    : `accounts/${locationName}`;

  const collected: GoogleReview[] = [];
  let pageToken: string | undefined;
  let lastResponse: ListReviewsResponse = {};
  let aggregateFromFirstPage: Pick<
    ListReviewsResponse,
    "averageRating" | "totalReviewCount"
  > = {};

  while (collected.length < maxReviews) {
    const pageSize = Math.min(50, maxReviews - collected.length);
    const url = new URL(
      `${MYBUSINESS_BASE}/${parent}/reviews`,
    );
    url.searchParams.set("pageSize", String(pageSize));
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    if (orderBy) url.searchParams.set("orderBy", orderBy);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(
        `Google Business reviews.list failed: ${res.status} ${errText}`,
      );
    }

    const json = (await res.json()) as ListReviewsResponse;
    lastResponse = json;
    if (collected.length === 0) {
      aggregateFromFirstPage = {
        averageRating: json.averageRating,
        totalReviewCount: json.totalReviewCount,
      };
    }

    const batch = json.reviews ?? [];
    for (const r of batch) {
      collected.push(r);
      if (collected.length >= maxReviews) break;
    }

    if (!json.nextPageToken || batch.length === 0) break;
    pageToken = json.nextPageToken;
  }

  return {
    ...lastResponse,
    averageRating: aggregateFromFirstPage.averageRating ??
      lastResponse.averageRating,
    totalReviewCount: aggregateFromFirstPage.totalReviewCount ??
      lastResponse.totalReviewCount,
    reviews: collected,
    reviewsNormalized: collected.length,
  };
}

/** In-memory cache for repeat SSR hits (reduces API quota). */
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const reviewListCache = new Map<string, CacheEntry<unknown>>();

export async function getCachedReviews<T>(
  cacheKey: string,
  ttlSeconds: number,
  factory: () => Promise<T>,
): Promise<T> {
  const now = Date.now();
  const hit = reviewListCache.get(cacheKey) as CacheEntry<T> | undefined;
  if (hit && hit.expiresAt > now) {
    return hit.value;
  }
  const value = await factory();
  reviewListCache.set(cacheKey, {
    value,
    expiresAt: now + ttlSeconds * 1000,
  });
  return value;
}

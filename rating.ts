export const RATING_MAP = [4.2, 4.4, 4.6, 4.8, 5.0] as const;

export interface VotePayload {
  url: string;
  rating: number;
}

export interface RatingResponse {
  ratingValue: number;
  reviewCount: number;
}

export async function getRating(
  postUrl: string,
  siteUrl: string
): Promise<RatingResponse> {
  const base = siteUrl.replace(/\/$/, "");
  const apiUrl = `${base}/api/votes?url=${encodeURIComponent(postUrl)}`;

  const attempt = async (): Promise<RatingResponse> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as RatingResponse;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  };

  try {
    return await attempt();
  } catch {
    try {
      return await attempt();
    } catch (err) {
      console.warn(`[getRating] No se pudo obtener rating para ${postUrl}:`, err);
      return { ratingValue: 0, reviewCount: 0 };
    }
  }
}

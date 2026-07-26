// Adaptador Vercel Functions — autocontenido. Usa @vercel/kv (ahora vía Upstash Redis).
// Si deployás en Cloudflare Pages, este archivo es inerte.
import { kv } from "@vercel/kv";

const VALID_RATINGS = new Set([4.2, 4.4, 4.6, 4.8, 5.0]);

function computeStats(ratings: number[]): { ratingValue: number; reviewCount: number } {
  if (ratings.length === 0) return { ratingValue: 0, reviewCount: 0 };
  const sum = ratings.reduce((a, b) => a + b, 0);
  return {
    ratingValue: Math.round((sum / ratings.length) * 10) / 10,
    reviewCount: ratings.length,
  };
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) {
    return Response.json({ error: "Missing url param" }, { status: 400 });
  }

  const key = `votes:${encodeURIComponent(url)}`;
  try {
    const ratings = (await kv.get<number[]>(key)) ?? [];
    return Response.json(computeStats(ratings));
  } catch {
    return Response.json({ error: "Storage error" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: { url?: unknown; rating?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { url, rating } = body;
  if (typeof url !== "string" || !url || typeof rating !== "number" || !VALID_RATINGS.has(rating)) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const key = `votes:${encodeURIComponent(url)}`;
  try {
    const existing = (await kv.get<number[]>(key)) ?? [];
    await kv.set(key, [...existing, rating]);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Storage error" }, { status: 500 });
  }
}

// Adaptador Cloudflare Pages Functions — autocontenido. Usa Workers KV via binding RATINGS_KV.
// Si deployás en Vercel, este archivo es inerte.
// El binding debe configurarse en Cloudflare Dashboard → Pages → Settings → Functions → KV bindings.

const VALID_RATINGS = new Set([4.2, 4.4, 4.6, 4.8, 5.0]);

function computeStats(ratings) {
  if (ratings.length === 0) return { ratingValue: 0, reviewCount: 0 };
  const sum = ratings.reduce((a, b) => a + b, 0);
  return {
    ratingValue: Math.round((sum / ratings.length) * 10) / 10,
    reviewCount: ratings.length,
  };
}

export async function onRequest(context) {
  const { request, env } = context;
  const kv = env.RATINGS_KV;

  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  if (request.method === "POST") {
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: corsHeaders });
    }

    const { url, rating } = body;
    if (typeof url !== "string" || !url || typeof rating !== "number" || !VALID_RATINGS.has(rating)) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400, headers: corsHeaders });
    }

    const key = `votes:${encodeURIComponent(url)}`;
    try {
      const raw = await kv.get(key);
      const existing = raw ? JSON.parse(raw) : [];
      await kv.put(key, JSON.stringify([...existing, rating]));
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
    } catch {
      return new Response(JSON.stringify({ error: "Storage error" }), { status: 500, headers: corsHeaders });
    }
  }

  if (request.method === "GET") {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    if (!url) {
      return new Response(JSON.stringify({ error: "Missing url param" }), { status: 400, headers: corsHeaders });
    }

    const key = `votes:${encodeURIComponent(url)}`;
    try {
      const raw = await kv.get(key);
      const ratings = raw ? JSON.parse(raw) : [];
      return new Response(JSON.stringify(computeStats(ratings)), { status: 200, headers: corsHeaders });
    } catch {
      return new Response(JSON.stringify({ error: "Storage error" }), { status: 500, headers: corsHeaders });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
}

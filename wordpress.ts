import type { WPPost, WPCategory, NormalizedPost } from "./wordpress-types";

const WP_API_BASE = import.meta.env.WP_API_BASE || "https://{{wordpress-url}}/wp-json/wp/v2";

const FIELDS = "id,slug,title,excerpt,content,date,author,rank_math_seo,_links,_embedded";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function normalizePost(wp: WPPost): NormalizedPost {
  const media = wp._embedded?.["wp:featuredmedia"]?.[0];
  const image =
    media?.media_details?.sizes?.large?.source_url ??
    media?.media_details?.sizes?.medium_large?.source_url ??
    media?.source_url ??
    null;

  const wpAuthor = wp._embedded?.author?.[0];
  const author = {
    name: wpAuthor?.name ?? "{{site-name}}",
    avatar: wpAuthor?.avatar_urls?.["96"] ?? null,
  };

  const terms = wp._embedded?.["wp:term"]?.[0];
  const category = terms?.[0]?.name ?? "Blog";

  const rawExcerpt = stripHtml(wp.excerpt?.rendered ?? "");
  const seoTitle = wp.rank_math_seo?.title ?? `${stripHtml(wp.title.rendered)} | Blog {{site-name}}`;
  const seoDesc = wp.rank_math_seo?.description ?? rawExcerpt.slice(0, 160);

  return {
    id: wp.id,
    slug: wp.slug,
    title: stripHtml(wp.title.rendered),
    excerpt: rawExcerpt,
    content: wp.content?.rendered ?? "",
    date: new Date(wp.date).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    image,
    category,
    author,
    seo: { title: seoTitle, description: seoDesc },
  };
}

export async function fetchPosts(perPage = 12): Promise<NormalizedPost[]> {
  try {
    const res = await fetch(
      `${WP_API_BASE}/posts?_embed&per_page=${perPage}&_fields=${FIELDS}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts: WPPost[] = await res.json();
    return posts.map(normalizePost);
  } catch (err) {
    console.error("[wordpress] fetchPosts failed:", err);
    return [];
  }
}

export async function fetchAllSlugs(): Promise<string[]> {
  try {
    const res = await fetch(
      `${WP_API_BASE}/posts?per_page=100&_fields=id,slug`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts: Pick<WPPost, "id" | "slug">[] = await res.json();
    return posts.map((p) => p.slug);
  } catch (err) {
    console.error("[wordpress] fetchAllSlugs failed:", err);
    return [];
  }
}

export async function fetchPostsPaginated(page = 1, perPage = 9): Promise<{ posts: NormalizedPost[]; totalPages: number }> {
  try {
    const res = await fetch(
      `${WP_API_BASE}/posts?_embed&page=${page}&per_page=${perPage}&_fields=${FIELDS}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const totalPages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1", 10);
    const posts: WPPost[] = await res.json();
    return { posts: posts.map(normalizePost), totalPages };
  } catch (err) {
    console.error("[wordpress] fetchPostsPaginated failed:", err);
    return { posts: [], totalPages: 1 };
  }
}

export async function fetchCategories(): Promise<WPCategory[]> {
  try {
    const res = await fetch(`${WP_API_BASE}/categories?per_page=100&hide_empty=true`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("[wordpress] fetchCategories failed:", err);
    return [];
  }
}

export async function fetchPostsByCategory(
  categoryId: number,
  page = 1,
  perPage = 9
): Promise<{ posts: NormalizedPost[]; totalPages: number }> {
  try {
    const res = await fetch(
      `${WP_API_BASE}/posts?_embed&categories=${categoryId}&page=${page}&per_page=${perPage}&_fields=${FIELDS}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const totalPages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1", 10);
    const posts: WPPost[] = await res.json();
    return { posts: posts.map(normalizePost), totalPages };
  } catch (err) {
    console.error("[wordpress] fetchPostsByCategory failed:", err);
    return { posts: [], totalPages: 1 };
  }
}

export async function fetchPostBySlug(slug: string): Promise<NormalizedPost | null> {
  try {
    const res = await fetch(
      `${WP_API_BASE}/posts?slug=${slug}&_embed&_fields=${FIELDS}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts: WPPost[] = await res.json();
    if (!posts.length) return null;
    return normalizePost(posts[0]);
  } catch (err) {
    console.error(`[wordpress] fetchPostBySlug(${slug}) failed:`, err);
    return null;
  }
}

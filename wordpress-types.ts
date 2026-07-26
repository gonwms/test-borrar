export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    sizes?: {
      medium_large?: { source_url: string };
      large?: { source_url: string };
    };
  };
}

export interface WPAuthor {
  id: number;
  name: string;
  description: string;
  avatar_urls: { "96"?: string };
}

export interface WPEmbedded {
  "wp:featuredmedia"?: WPMedia[];
  "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>;
  author?: WPAuthor[];
}

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  rank_math_seo?: { title?: string; description?: string };
  _embedded: WPEmbedded;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface NormalizedPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string | null;
  category: string;
  author: { name: string; avatar: string | null; role?: string };
  seo: { title: string; description: string };
}

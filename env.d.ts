/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly WP_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

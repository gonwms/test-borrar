// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { clickToSource } from "astro-click-to-source";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// Plugin para eliminar comentarios HTML del bundle final
const removeHtmlComments = {
  name: "remove-html-comments",
  apply: /** @type {const} */ ("build"),
  enforce: /** @type {const} */ ("post"),
  // @ts-ignore — transformIndexHtml signature no está tipada en la interfaz Plugin de Vite
  transformIndexHtml(html) {
    if (typeof html === "string") {
      return html.replace(/<!--[\s\S]*?-->/g, "");
    }
    return html;
  },
};

// ── DEPLOY CONFIG ─────────────────────────────────────────────────────────────
// Descomentar SOLO el bloque correspondiente a la plataforma de deploy.
// Dejar el resto comentado.

/* DEPLOY: GITHUB PAGES */
// let DEPLOY_DOMAIN = "https://usuario.github.io";
// let DEPLOY_PATH = "/base-astro/";

/* DEPLOY: VERCEL*/
// let DEPLOY_DOMAIN = "https://base-astro.vercel.app";
// let DEPLOY_PATH = "/";

/* DEPLOY: CLOUDFLARE PAGES*/
let DEPLOY_DOMAIN = "https://base-astro.pages.dev";
let DEPLOY_PATH = "/";

/* DOMINIO CUSTOM (cualquier plataforma)
DEPLOY_DOMAIN = "https://ejemplo.com";
DEPLOY_PATH = "/";
*/
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  site: DEPLOY_DOMAIN,
  base: DEPLOY_PATH,
  build: { assets: "assets" },
  integrations: [clickToSource(), mdx(), sitemap(), icon({ include: { "material-symbols": ["*"], "simple-icons": ["*"] } })],
  vite: {
    plugins: [tailwindcss(), removeHtmlComments],
    optimizeDeps: {
      include: ["embla-carousel", "embla-carousel-auto-scroll"],
    },
  },
});

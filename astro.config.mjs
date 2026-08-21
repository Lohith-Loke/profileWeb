import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://lohith.io",
  base: "",

  output: "static",

  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [mdx(), sitemap()],
  adapter: cloudflare(),
});

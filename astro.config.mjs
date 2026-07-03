// @ts-check
import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://lohith.io",
  base: "",
  output: 'server',
  adapter: cloudflare(),
  // Add this block 👇
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp' // Or try 'astro/assets/services/noop' if it still fails
    }
  }
});

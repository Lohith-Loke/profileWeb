import { defineConfig } from 'astro/config';

export default defineConfig({
  site: "https://lohith.io",
  base: "",
  output: 'static', // 1. Change from 'server' to 'static'
  // 2. Remove the adapter: cloudflare() line completely
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp' 
    }
  }
});
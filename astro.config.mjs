import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: "https://lohith.io",
  base: "",

  // 1. Change from 'server' to 'static'
  output: 'static',

  // 2. Remove the adapter: cloudflare() line completely
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop' 
    }
  },
  
  integrations: [mdx(),sitemap()]
  adapter: cloudflare()
});
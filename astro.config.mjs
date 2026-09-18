// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mojacijena.hr',
  // Kontakt je SSR pa ga integracija sama ne vidi; dodan ručno.
  integrations: [sitemap({ customPages: ['https://mojacijena.hr/kontakt/'] })],
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  vite: { plugins: [tailwindcss()] },
  security: { checkOrigin: false },
});

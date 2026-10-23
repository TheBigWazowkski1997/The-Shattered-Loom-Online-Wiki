import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { remarkObsidian } from './src/plugins/remark-obsidian.js';

export default defineConfig({
  site: 'https://thebigwazowkski1997.github.io',
  base: '/The-Shattered-Loom-Online-Wiki',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [[remarkObsidian, { baseUrl: '/The-Shattered-Loom-Online-Wiki' }]],
  },
});

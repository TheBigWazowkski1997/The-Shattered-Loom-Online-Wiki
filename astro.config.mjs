import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { remarkObsidian } from './src/plugins/remark-obsidian.js';

export default defineConfig({
  site: 'https://thebigwazowkski1997.github.io',
  base: '/The-Shattered-Loom-Online-Wiki',
  integrations: [sitemap()],
  markdown: unified({
    remarkPlugins: [[remarkObsidian, { baseUrl: '/The-Shattered-Loom-Online-Wiki' }]],
  }),
});

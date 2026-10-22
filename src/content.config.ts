import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
  wiki: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/wiki' }),
    schema: z.record(z.any()).optional(),
  }),
};

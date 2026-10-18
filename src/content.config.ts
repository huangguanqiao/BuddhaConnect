import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string().default('生活智慧'),
    articleId: z.string().optional(),
    language: z.enum(['zh-CN','zh-TW','en']).default('zh-CN'),
    slug: z.string().optional(),
    published: z.boolean().default(true),
    qaStatus: z.enum(['Pending','Passed','Failed','Needs Human Review']).optional(),
    section: z.enum(['start','teachings','practice']).default('teachings'),
  }),
});
export const collections = { articles };

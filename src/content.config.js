import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const generateId = ({ entry }) => entry.replace(/\.md$/, '')

const baseSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  published: z.boolean().default(true),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  header: z.object({ teaser: z.string().optional() }).default({}),
  filters: z.record(z.string(), z.string().nullable()).default({}),
}).loose()

const publications = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/publications', generateId }),
  schema: baseSchema.extend({
    author: z.string().optional(),
    hidden: z.boolean().optional(),
  }),
})

const events = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/events', generateId }),
  schema: baseSchema.extend({
    link: z.string(),
  }),
})

export const collections = { publications, events }

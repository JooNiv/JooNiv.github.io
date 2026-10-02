// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import pagefind from 'astro-pagefind'
import { unified } from '@astrojs/markdown-remark'
import remarkMath from 'remark-math'
import { isProductionSite, siteUrl } from './src/lib/env.js'
import { redirectPaths } from './src/lib/redirects.js'
import rehypeTeaser from './src/lib/rehype-teaser.js'
import rehypeMathPassthrough from './src/lib/rehype-math-passthrough.js'

const excludedFromSitemap = page => {
  const path = new URL(page).pathname.replace(/(\.html|\/)$/, '')
  return /^\/(api|events)\/.+/.test(path) || path === '/404' || redirectPaths.includes(path)
}

export default defineConfig({
  site: siteUrl,
  trailingSlash: 'ignore',
  build: { format: 'preserve' },
  integrations: [
    react(),
    pagefind(),
    ...(isProductionSite ? [sitemap({ filter: page => !excludedFromSitemap(page) })] : []),
  ],
  markdown: {
    processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeMathPassthrough, rehypeTeaser] }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
  vite: { plugins: [tailwindcss()] },
})

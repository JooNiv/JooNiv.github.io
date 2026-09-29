// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { unified } from '@astrojs/markdown-remark'
import remarkMath from 'remark-math'
import { isProductionSite, siteUrl } from './src/lib/env.js'
import { redirectPaths } from './src/lib/redirects.js'
import rehypeTeaser from './src/lib/rehype-teaser.js'
import rehypeMathPassthrough from './src/lib/rehype-math-passthrough.js'

const excludedFromSitemap = [/\/api\//, /\/search-index\.json/, /\/events\/.+\.html$/, /\/404\.html$/]

export default defineConfig({
  site: siteUrl,
  trailingSlash: 'ignore',
  build: { format: 'preserve' },
  integrations: [
    react(),
    ...(isProductionSite
      ? [sitemap({
        filter: page => {
          const { pathname } = new URL(page)
          return !excludedFromSitemap.some(re => re.test(pathname))
            && !redirectPaths.some(p => pathname.replace(/(\.html|\/)$/, '') === p)
        },
      })]
      : []),
  ],
  markdown: {
    processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeMathPassthrough, rehypeTeaser] }),
    shikiConfig: { theme: 'github-light' },
  },
  vite: { plugins: [tailwindcss()] },
})

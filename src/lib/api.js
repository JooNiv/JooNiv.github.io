/** Builds the /api/*.json payloads, keeping the field layout of the old Jekyll site's JSON API. */
import { getPublicationEntries, getEventEntries, publicationUrl, eventUrl } from './site.js'
import { pages } from './pages.js'
import { redirectPaths } from './redirects.js'

const documentJson = (entry, collection, url) => {
  const { date, ...data } = entry.data
  return {
    ...data,
    date: date.toISOString(),
    id: url.replace(/\.html$/, ''),
    url,
    slug: entry.id,
    collection,
    path: `_${collection}/${entry.id}.md`,
    relative_path: `_${collection}/${entry.id}.md`,
    ext: '.md',
    draft: false,
    categories: [],
    content: entry.rendered?.html || '',
  }
}

export const publicationsJson = async () =>
  (await getPublicationEntries()).map(entry => documentJson(entry, 'publications', publicationUrl(entry.id)))

export const eventsJson = async () =>
  (await getEventEntries()).map(entry => documentJson(entry, 'events', eventUrl(entry.id)))

export const pagesJson = () => [
  ...pages.map(page => ({ name: page.path.split('/').pop(), path: page.path, url: page.url, title: page.title })),
  ...redirectPaths.map(url => ({ url, redirect: true, sitemap: false })),
]

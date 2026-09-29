import { getCollection } from 'astro:content'
import { constants } from './constants.js'
import { pages } from './pages.js'

const pad = n => String(n).padStart(2, '0')
export const formatDMY = date => `${date.getUTCDate()}.${date.getUTCMonth() + 1}.${date.getUTCFullYear()}`
export const formatISODate = date => `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`

const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
const decodeEntities = text => text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) =>
  code[0] !== '#' ? entities[code.toLowerCase()] ?? match
    : String.fromCodePoint(code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)))
export const stripHtml = html => decodeEntities((html || '').replace(/<[^>]*>/g, '').replace(/\n/g, ''))
const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const flattenStrings = value =>
  typeof value === 'string' ? [value]
    : Array.isArray(value) ? value.flatMap(flattenStrings)
      : value && typeof value === 'object' ? Object.values(value).flatMap(flattenStrings)
        : []

const byDate = (a, b) => a.data.date - b.data.date || a.id.localeCompare(b.id)
const filtersAsStrings = filters => Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, v ?? '']))

export const publicationUrl = id => `/publications/${id}.html`
export const eventUrl = id => `/events/${id}.html`

export const getPublicationEntries = async () =>
  (await getCollection('publications', ({ data }) => data.published)).sort(byDate)

export const getEventEntries = async () =>
  (await getCollection('events', ({ data }) => data.published)).sort(byDate)

const isVisible = entry => !entry.data.hidden

export const getPublications = async () =>
  (await getPublicationEntries()).filter(isVisible).map((entry, index) => ({
    key: String(index + 1),
    type: entry.data.filters.Type || 'Post',
    title: entry.data.title,
    url: publicationUrl(entry.id),
    date: formatDMY(entry.data.date),
    teaser: entry.data.header.teaser || '',
    hidden: JSON.stringify(entry.data.hidden ?? null),
    filters: filtersAsStrings(entry.data.filters),
  }))

export const getEvents = async () =>
  (await getEventEntries()).map((entry, index) => ({
    key: String(index + 1),
    type: 'Event',
    title: entry.data.title,
    url: encodeURI(entry.data.link),
    date: formatISODate(entry.data.date),
    content: stripHtml(entry.rendered?.html),
    filters: filtersAsStrings(entry.data.filters),
  }))

export const getSearchStore = async () => ({
  blogs: (await getPublicationEntries()).filter(isVisible).map(entry => ({
    key: slugify(publicationUrl(entry.id)),
    title: entry.data.title,
    content: stripHtml(entry.rendered?.html),
    url: publicationUrl(entry.id),
    tags: entry.data.tags,
    type: entry.data.filters.Type || 'post',
    date: formatDMY(entry.data.date),
  })),
  events: (await getEventEntries()).map(entry => ({
    key: slugify(eventUrl(entry.id)),
    title: entry.data.title,
    content: stripHtml(entry.rendered?.html),
    url: eventUrl(entry.id),
    tags: entry.data.tags,
    type: 'Event',
    date: formatDMY(entry.data.date),
    link: entry.data.link,
  })),
  pages: pages.map(page => ({
    key: slugify(page.url) || 'index',
    title: page.title,
    content: stripHtml(flattenStrings(constants[page.url]).join(' ')),
    url: page.url,
    tags: [],
    type: 'page',
  })),
})

export const getNavItems = () =>
  (constants.header_nav || []).map(item => ({
    title: item.title,
    href: pages.find(page => page.path === item.page)?.url || '/',
  }))

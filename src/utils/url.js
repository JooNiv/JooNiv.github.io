const base = import.meta.env.BASE_URL.replace(/\/$/, '')

export const isExternal = href => /^([a-z][a-z0-9+.-]*:)?\/\//i.test(href || '') || /^(mailto|tel):/i.test(href || '')

export const isAnchor = href => (href || '').startsWith('#')

export const prependBaseURL = href => {
    if (!href || isExternal(href) || isAnchor(href)) return href
    return `${base}/${href.replace(/^\//, '')}`
}

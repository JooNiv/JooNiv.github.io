import { useEffect } from 'react'
import { useMatomo } from '../hooks/useMatomo'

const clearRahtiCookies = () => {
    for (const cookie of document.cookie.split(';')) {
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim()
        if (name.endsWith('.rahtiapp.fi')) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.rahtiapp.fi`
        }
    }
}

export const SiteChrome = () => {
    useMatomo(import.meta.env.PUBLIC_MATOMO_URL, import.meta.env.PUBLIC_MATOMO_TAG_MANAGER_CONTAINER)

    useEffect(() => {
        const consent = document.cookie.split('; ').find(row => row.startsWith('cookie_consent='))
        if (consent?.split('=')[1] === 'false') clearRahtiCookies()
    }, [])

    return null
}

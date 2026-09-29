const buildingRepo = process.env.GITHUB_REPOSITORY || ''

export const isProductionSite = buildingRepo === 'FiQCI/fiqci.github.io'
export const isDevSite = !isProductionSite
export const siteUrl = isProductionSite ? 'https://fiqci.fi' : 'https://dev.fiqci.fi'

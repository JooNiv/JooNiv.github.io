/** Build target (production fiqci.fi or dev.fiqci.fi), chosen by the GitHub repository being built. */
const buildingRepo = process.env.GITHUB_REPOSITORY || ''

export const isProductionSite = buildingRepo === 'FiQCI/fiqci.github.io'
export const isDevSite = !isProductionSite
export const siteUrl = isProductionSite ? 'https://fiqci.fi' : 'https://dev.fiqci.fi'

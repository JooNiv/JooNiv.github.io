import { pagesJson } from '../../lib/api.js'

export const GET = () => Response.json(pagesJson())

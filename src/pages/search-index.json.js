import { getSearchStore } from '../lib/site.js'

export const GET = async () => Response.json(await getSearchStore())

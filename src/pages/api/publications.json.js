import { publicationsJson } from '../../lib/api.js'

export const GET = async () => Response.json(await publicationsJson())

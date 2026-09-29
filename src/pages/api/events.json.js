import { eventsJson } from '../../lib/api.js'

export const GET = async () => Response.json(await eventsJson())

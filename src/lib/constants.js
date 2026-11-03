/** Site content and author data parsed from src/data/*.yml. */
import { parse } from 'yaml'
import constantsRaw from '../data/constants.yml?raw'
import authorsRaw from '../data/authors.yml?raw'

export const constants = parse(constantsRaw)
export const authors = parse(authorsRaw)

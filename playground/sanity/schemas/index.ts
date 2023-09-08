import {localeStringSchema, mediaSchema} from './objects'
import {pageSchema} from './documents'

const objects = [localeStringSchema, mediaSchema]
const documents = [pageSchema]

export const schemaTypes = [...objects, ...documents]

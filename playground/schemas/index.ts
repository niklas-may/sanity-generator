import {localeStringSchema, mediaSchema} from './objects'
import {pageSchema} from './documents'

const documents = [pageSchema]
const objects = [localeStringSchema, mediaSchema]

export const schemaTypes = [...objects, ...documents]

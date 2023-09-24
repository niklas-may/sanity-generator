import {localeStringSchema, mediaSchema} from './types'
import {pageSchema} from './documents'

const documents = [pageSchema]
const types = [localeStringSchema, mediaSchema]

export const schemaTypes = [...types, ...documents]

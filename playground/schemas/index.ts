import {localeStringSchema} from './types'
import {pageSchema} from './documents'

const documents = [pageSchema]
const types = [localeStringSchema]

export const schemaTypes = [...types, ...documents]

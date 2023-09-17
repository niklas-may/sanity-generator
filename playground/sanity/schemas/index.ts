import {localeStringSchema, mediaSchema} from './objects'
import {pageSchema} from './documents'
import {getPages} from '../sanity-generator/queries/get-pages'
import {createClient} from '@sanity/client'

const documents = [pageSchema]
const objects = [localeStringSchema, mediaSchema]

export const schemaTypes = [...objects, ...documents]

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
})
console.log(getPages)
async function main() {
  const res = await client.fetch(getPages, {lang: 'en'})
  console.log('res ', res)
}

main()

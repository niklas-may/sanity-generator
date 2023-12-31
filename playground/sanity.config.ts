import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import { getPages } from './generator-output/queries'

import { createClient } from '@sanity/client'


export default defineConfig({
  name: 'default',
  title: 'Sanity-Monolyth',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

const client = createClient({
  projectId: "gmpiajy6",
  dataset: process.env.SANITY_STUDIO_DATASET!,
  apiVersion: "2023-09-23",
  useCdn: false,
})

async function main(){
  const res = await client.fetch(getPages, {lang: "en"})
  console.log(res)
}
main()






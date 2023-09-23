import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Sanity Generator',

  projectId: "gmpiajy6",
  dataset: "test-suite",

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})




import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schema-types'
import config from "../sanity-client-config"

export default defineConfig({
  name: 'default',
  title: 'Sanity-Monolyth',

  projectId: config.projectId,
  dataset: config.dataset,

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})




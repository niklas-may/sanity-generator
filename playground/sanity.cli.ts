import {defineCliConfig} from 'sanity/cli'
import {sanityGenerator} from '../../src/plugin/main'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET!,
  },
  vite: {
    plugins: [sanityGenerator()],
  },
})

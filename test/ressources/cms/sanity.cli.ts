import {defineCliConfig} from 'sanity/cli'
import config from '../sanity-client-config'

export default defineCliConfig({
  api: {
    projectId: config.projectId,
    dataset: config.dataset,
  },
})

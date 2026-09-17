import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'u0t97g4u',
    dataset: 'production'
  },
  typegen: {
    path: ['../src/**/*.{ts,tsx,js,jsx}', './lib/**/*.{ts,tsx,js,jsx}'],
    schema: './schema.json',
    generates: '../sanity.types.ts',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})

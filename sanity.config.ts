import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { schemaTypes, singletonTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'sandys_traveling_camera',

  projectId: 'u0t97g4u',
  dataset: 'production',

  basePath: '/studio',

  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: '2026-02-01' })],

  schema: {
    types: schemaTypes,
    // Singletons are created and reached through Structure only.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({ action }) =>
            ['publish', 'discardChanges', 'restore'].includes(action ?? ''),
          )
        : actions,
  },
})

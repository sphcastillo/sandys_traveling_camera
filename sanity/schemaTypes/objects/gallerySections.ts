import { defineArrayMember, defineField, defineType, type FieldDefinition } from 'sanity'

const photoRefs = defineField({
  name: 'photos',
  title: 'Photos',
  type: 'array',
  hidden: ({ parent }) => parent?.source !== 'manual',
  of: [defineArrayMember({ type: 'reference', to: [{ type: 'photo' }] })],
  options: { layout: 'grid' },
})

const source = defineField({
  name: 'source',
  title: 'Photos from',
  type: 'string',
  options: {
    list: [
      { title: 'Every photo in this country', value: 'countryAll' },
      { title: 'A hand-picked selection', value: 'manual' },
    ],
    layout: 'radio',
  },
  initialValue: 'countryAll',
})

const limit = defineField({
  name: 'limit',
  title: 'Maximum photos',
  type: 'number',
  description: 'Leave empty to show everything.',
  validation: (rule) => rule.min(1).integer(),
})

const sharedFields: FieldDefinition[] = [
  defineField({ name: 'title', type: 'string' }),
  defineField({ name: 'intro', type: 'text', rows: 2, description: 'Optional short caption.' }),
  source,
  photoRefs,
  limit,
  defineField({
    name: 'showCaptions',
    title: 'Show captions',
    type: 'boolean',
    initialValue: false,
  }),
]

export const galleryGrid = defineType({
  name: 'galleryGrid',
  title: 'Gallery — grid',
  type: 'object',
  fields: [
    ...sharedFields,
    defineField({
      name: 'columns',
      type: 'number',
      initialValue: 3,
      options: { list: [2, 3, 4] },
    }),
    defineField({
      name: 'aspect',
      title: 'Crop',
      type: 'string',
      initialValue: 'landscape',
      options: {
        list: [
          { title: 'Square', value: 'square' },
          { title: 'Landscape (3:2)', value: 'landscape' },
          { title: 'Portrait (2:3)', value: 'portrait' },
          { title: 'Tall (4:5)', value: 'tall' },
        ],
      },
    }),
    defineField({
      name: 'gap',
      title: 'Spacing',
      type: 'string',
      initialValue: 'normal',
      options: {
        list: [
          { title: 'Tight', value: 'tight' },
          { title: 'Normal', value: 'normal' },
          { title: 'Roomy', value: 'roomy' },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Grid gallery', subtitle: 'Grid' }),
  },
})

export const galleryMasonry = defineType({
  name: 'galleryMasonry',
  title: 'Gallery — masonry',
  type: 'object',
  fields: [
    ...sharedFields,
    defineField({
      name: 'columns',
      type: 'number',
      initialValue: 3,
      options: { list: [2, 3, 4] },
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Masonry gallery', subtitle: 'Masonry' }),
  },
})

export const galleryCarousel = defineType({
  name: 'galleryCarousel',
  title: 'Gallery — carousel',
  type: 'object',
  fields: [
    ...sharedFields,
    defineField({
      name: 'variant',
      title: 'Carousel style',
      type: 'string',
      initialValue: 'peek',
      options: {
        list: [
          { title: 'Full-bleed — one photo at a time, edge to edge', value: 'fullBleed' },
          { title: 'Peek — cards with the next one showing', value: 'peek' },
          { title: 'Filmstrip — big photo with a thumbnail rail', value: 'filmstrip' },
          { title: 'Cards — evenly sized tiles', value: 'cards' },
        ],
      },
    }),
    defineField({
      name: 'aspect',
      title: 'Crop',
      type: 'string',
      initialValue: 'landscape',
      options: {
        list: [
          { title: 'Square', value: 'square' },
          { title: 'Landscape (3:2)', value: 'landscape' },
          { title: 'Portrait (2:3)', value: 'portrait' },
          { title: 'Cinematic (21:9)', value: 'cinematic' },
        ],
      },
    }),
    defineField({ name: 'autoplay', type: 'boolean', initialValue: false }),
    defineField({
      name: 'autoplayDelay',
      title: 'Seconds between slides',
      type: 'number',
      initialValue: 5,
      hidden: ({ parent }) => !parent?.autoplay,
      validation: (rule) => rule.min(2).max(30),
    }),
    defineField({ name: 'showArrows', title: 'Show arrows', type: 'boolean', initialValue: true }),
    defineField({ name: 'showDots', title: 'Show dots', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'title', variant: 'variant' },
    prepare: ({ title, variant }) => ({
      title: title || 'Carousel',
      subtitle: `Carousel — ${variant || 'peek'}`,
    }),
  },
})

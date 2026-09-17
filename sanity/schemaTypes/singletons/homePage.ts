import { defineArrayMember, defineField, defineType } from 'sanity'

const sectionHeading = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    group: 'sections',
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: 'title', type: 'string' }),
      defineField({ name: 'intro', type: 'text', rows: 2 }),
    ],
  })

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'sections', title: 'Sections' },
  ],
  fields: [
    defineField({
      name: 'hero',
      type: 'heroMedia',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro sentence',
      type: 'text',
      group: 'sections',
      rows: 3,
      description: 'A line or two about her travels, just under the hero.',
    }),
    defineField({
      name: 'favorites',
      title: 'My Favorites carousel',
      type: 'object',
      group: 'sections',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'title', type: 'string', initialValue: 'My Favorites' }),
        defineField({ name: 'intro', type: 'text', rows: 2 }),
        defineField({
          name: 'countries',
          type: 'array',
          of: [defineArrayMember({ type: 'reference', to: [{ type: 'country' }] })],
          validation: (rule) => rule.min(1),
        }),
        defineField({
          name: 'variant',
          title: 'Carousel style',
          type: 'string',
          initialValue: 'peek',
          options: {
            list: [
              { title: 'Peek — cards with the next one showing', value: 'peek' },
              { title: 'Cards — evenly sized tiles', value: 'cards' },
              { title: 'Full-bleed', value: 'fullBleed' },
            ],
          },
        }),
        defineField({ name: 'autoplay', type: 'boolean', initialValue: false }),
      ],
    }),
    sectionHeading('continents', 'Explore by Continent'),
    defineField({
      name: 'recentTrip',
      title: 'Most recent trip',
      type: 'object',
      group: 'sections',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'title', type: 'string', initialValue: 'Most Recent Trip' }),
        defineField({ name: 'intro', type: 'text', rows: 2 }),
        defineField({
          name: 'trip',
          type: 'reference',
          to: [{ type: 'trip' }],
          description: 'Leave empty to show whichever trip has the latest start date.',
        }),
      ],
    }),
    defineField({
      name: 'whereToNext',
      title: 'Where to Next',
      type: 'object',
      group: 'sections',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'title', type: 'string', initialValue: 'Where to Next' }),
        defineField({ name: 'intro', type: 'text', rows: 2 }),
        defineField({
          name: 'destinations',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'destination',
              fields: [
                defineField({
                  name: 'name',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
                defineField({ name: 'note', type: 'text', rows: 2 }),
                defineField({ name: 'when', title: 'Roughly when', type: 'string' }),
                defineField({
                  name: 'image',
                  type: 'image',
                  options: { hotspot: true },
                  fields: [defineField({ name: 'alt', type: 'string' })],
                }),
              ],
              preview: { select: { title: 'name', subtitle: 'when', media: 'image' } },
            }),
          ],
        }),
      ],
    }),
    sectionHeading('featuredDestinations', 'Featured Destinations'),
    sectionHeading('latestNotes', 'Latest Travel Notes'),
    defineField({
      name: 'aboutTeaser',
      title: 'About the Photographer',
      type: 'object',
      group: 'sections',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'title', type: 'string', initialValue: 'About the Photographer' }),
        defineField({ name: 'text', type: 'text', rows: 5 }),
        defineField({ name: 'ctaLabel', type: 'string', initialValue: 'Meet Sandy' }),
        defineField({
          name: 'image',
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', type: 'string' })],
        }),
      ],
    }),
    defineField({
      name: 'quoteBands',
      title: 'Quote bands',
      type: 'array',
      group: 'sections',
      description: 'Full-width sayings dropped between sections, in order.',
      of: [defineArrayMember({ type: 'quote' })],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Home page' }),
  },
})

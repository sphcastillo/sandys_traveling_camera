import { defineArrayMember, defineField, defineType } from 'sanity'

export const trip = defineType({
  name: 'trip',
  title: 'Trip',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'countries',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'country' }] })],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'startDate',
      title: 'Left home',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Came home',
      type: 'date',
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required().warning('Alt text matters for SEO and screen readers'),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photos',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'photo' }] })],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'seedKey',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Most recent',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'startDate', media: 'coverImage' },
  },
})

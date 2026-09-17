import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Photos are their own documents so a single uploaded asset can appear in a
 * country grid, a carousel, a trip and a travel note without being re-uploaded.
 */
export const photo = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
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
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'One short line. Let the photo do the talking.',
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: 'country',
      type: 'reference',
      to: [{ type: 'country' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Place',
      type: 'string',
      description: 'City, region or landmark.',
    }),
    defineField({
      name: 'capturedAt',
      title: 'Taken on',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
    }),
    defineField({
      name: 'featured',
      title: 'Favourite',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'seedKey',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      media: 'image',
      caption: 'caption',
      location: 'location',
      countryName: 'country.name',
    },
    prepare: ({ media, caption, location, countryName }) => ({
      title: caption || location || countryName || 'Photo',
      subtitle: [location, countryName].filter(Boolean).join(', ') || undefined,
      media,
    }),
  },
})

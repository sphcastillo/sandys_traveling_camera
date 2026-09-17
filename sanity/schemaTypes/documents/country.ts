import { defineArrayMember, defineField, defineType } from 'sanity'

export const country = defineType({
  name: 'country',
  title: 'Country',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'galleries', title: 'Galleries' },
    { name: 'story', title: 'Story' },
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'basics',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'continent',
      type: 'reference',
      group: 'basics',
      to: [{ type: 'continent' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isoNumeric',
      title: 'ISO 3166 numeric code',
      type: 'string',
      group: 'basics',
      description:
        'Three-digit code used to light this country up on the world map, e.g. 392 for Japan. Keep leading zeros.',
      validation: (rule) => rule.required().regex(/^\d{1,3}$/, { name: 'numeric code' }),
    }),
    defineField({
      name: 'isoAlpha2',
      title: 'ISO 3166 two-letter code',
      type: 'string',
      group: 'basics',
      description: 'e.g. JP. Used for the flag emoji.',
      validation: (rule) => rule.length(2).uppercase(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'basics',
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
      name: 'shortIntro',
      title: 'Short intro',
      type: 'text',
      group: 'basics',
      rows: 3,
      description: 'A sentence or two at the top of the page.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured country',
      type: 'boolean',
      group: 'basics',
      initialValue: false,
      description: 'Featured countries appear in the grid below the world map.',
    }),
    defineField({
      name: 'orderRank',
      title: 'Display order',
      type: 'number',
      group: 'basics',
      description: 'Lower numbers come first. Ties fall back to alphabetical.',
    }),
    defineField({
      name: 'sections',
      title: 'Galleries',
      type: 'array',
      group: 'galleries',
      description: 'Stack as many grids, masonry walls and carousels as the trip deserves.',
      of: [
        defineArrayMember({ type: 'galleryGrid' }),
        defineArrayMember({ type: 'galleryMasonry' }),
        defineArrayMember({ type: 'galleryCarousel' }),
      ],
    }),
    defineField({
      name: 'story',
      title: 'Travel story',
      type: 'blockContent',
      group: 'story',
      description: 'Always rendered at the very bottom of the page, beneath every photograph.',
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
      title: 'Display order',
      name: 'rankAsc',
      by: [
        { field: 'orderRank', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'continent.name', media: 'coverImage' },
  },
})

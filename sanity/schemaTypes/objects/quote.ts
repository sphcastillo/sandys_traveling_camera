import { defineField, defineType } from 'sanity'

export const quote = defineType({
  name: 'quote',
  title: 'Quote',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'attribution',
      type: 'string',
      description: 'Leave empty for an unattributed saying, e.g. "Adventure is out there".',
    }),
    defineField({
      name: 'image',
      title: 'Background image',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown behind the quote on quote bands. Crop with the hotspot to keep the subject in view.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) =>
            rule.required().warning('Alt text matters for SEO and screen readers'),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'text', subtitle: 'attribution', media: 'image' },
  },
})

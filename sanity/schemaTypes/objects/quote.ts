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
  ],
  preview: {
    select: { title: 'text', subtitle: 'attribution' },
  },
})

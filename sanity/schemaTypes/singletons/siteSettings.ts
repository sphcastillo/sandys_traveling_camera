import { defineArrayMember, defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
      initialValue: "Sandy's Traveling Camera",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      description: 'Powers the mail icon in the header and footer. There is no contact page.',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'footerNote',
      type: 'string',
    }),
    defineField({
      name: 'quotes',
      title: 'Quote bank',
      type: 'array',
      description: 'Sayings that can be dropped into quote bands around the site.',
      of: [defineArrayMember({ type: 'quote' })],
    }),
    defineField({
      name: 'ogImage',
      title: 'Social sharing image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string' })],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site settings' }),
  },
})

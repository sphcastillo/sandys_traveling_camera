import { defineArrayMember, defineField, defineType } from 'sanity'

const imageWithAlt = (name: string, title: string) =>
  defineField({
    name,
    title,
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
  })

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Meet Sandy',
  type: 'document',
  groups: [
    { name: 'intro', title: 'Intro', default: true },
    { name: 'camera', title: 'Behind the Camera' },
    { name: 'kit', title: 'Equipment & inspiration' },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'intro',
      initialValue: 'Meet Sandy',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      type: 'string',
      group: 'intro',
    }),
    imageWithAlt('portrait', 'Portrait'),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'blockContent',
      group: 'intro',
    }),
    defineField({
      name: 'behindTheCamera',
      title: 'Behind the Camera',
      type: 'object',
      group: 'camera',
      fields: [
        defineField({ name: 'title', type: 'string', initialValue: 'Behind the Camera' }),
        defineField({ name: 'intro', type: 'text', rows: 3 }),
        defineField({ name: 'body', type: 'blockContent' }),
        defineField({
          name: 'photos',
          title: 'Photos',
          type: 'array',
          of: [defineArrayMember({ type: 'reference', to: [{ type: 'photo' }] })],
          options: { layout: 'grid' },
        }),
      ],
    }),
    defineField({
      name: 'equipment',
      title: 'My equipment',
      type: 'object',
      group: 'kit',
      fields: [
        defineField({ name: 'title', type: 'string', initialValue: 'My Equipment' }),
        defineField({ name: 'intro', type: 'text', rows: 2 }),
        defineField({
          name: 'items',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'equipmentItem',
              fields: [
                defineField({
                  name: 'name',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'category',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Camera body', value: 'body' },
                      { title: 'Lens', value: 'lens' },
                      { title: 'Bag', value: 'bag' },
                      { title: 'Accessory', value: 'accessory' },
                    ],
                  },
                }),
                defineField({ name: 'note', type: 'text', rows: 2 }),
              ],
              preview: { select: { title: 'name', subtitle: 'category' } },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'inspiration',
      title: 'My inspiration',
      type: 'object',
      group: 'kit',
      fields: [
        defineField({ name: 'title', type: 'string', initialValue: 'My Inspiration' }),
        defineField({ name: 'body', type: 'blockContent' }),
        defineField({ name: 'quote', type: 'quote' }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Meet Sandy' }),
  },
})

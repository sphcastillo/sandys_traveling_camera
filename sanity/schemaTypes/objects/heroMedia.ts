import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Video is referenced by URL rather than uploaded as a Sanity `file` asset:
 * file assets are served as raw downloads with no transcoding, which gets
 * expensive fast for a full-bleed hero. The poster image is required so mobile
 * and slow connections always have something beautiful to show.
 */
export const heroMedia = defineType({
  name: 'heroMedia',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      options: {
        list: [
          { title: 'Image slides', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slides',
      title: 'Image slides',
      type: 'array',
      description: 'One slide holds still; two or more cross-fade automatically.',
      hidden: ({ parent }) => parent?.mediaType !== 'image',
      validation: (rule) =>
        rule.custom((slides, context) => {
          const parent = context.parent as { mediaType?: string } | undefined
          if (parent?.mediaType !== 'image') return true
          return Array.isArray(slides) && slides.length > 0 ? true : 'Add at least one slide'
        }),
      of: [
        defineArrayMember({
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
        }),
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'string',
      description:
        'A short, muted, looping MP4 or HLS stream — either an absolute URL or a path like /video/hero.mp4. Keep it under a few megabytes.',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { mediaType?: string } | undefined
          if (parent?.mediaType !== 'video') return true
          if (!value) return 'A video URL is required'
          return /^(https?:\/\/|\/)/.test(value)
            ? true
            : 'Use an absolute URL or a path starting with /'
        }),
    }),
    defineField({
      name: 'poster',
      title: 'Poster image',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown while the video loads, and in place of it on small screens.',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        }),
      ],
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { mediaType?: string } | undefined
          if (parent?.mediaType !== 'video') return true
          return value?.asset ? true : 'A poster image is required for video heroes'
        }),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small line above the headline, e.g. "Sandy\'s Traveling Camera".',
    }),
    defineField({
      name: 'headline',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subhead',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'quote',
      title: 'Hero quote',
      type: 'quote',
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary link',
      type: 'object',
      options: { columns: 2 },
      fields: [
        defineField({ name: 'label', type: 'string' }),
        defineField({ name: 'href', type: 'string', description: 'e.g. /countries' }),
      ],
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary link',
      type: 'object',
      options: { columns: 2 },
      fields: [
        defineField({ name: 'label', type: 'string' }),
        defineField({ name: 'href', type: 'string', description: 'e.g. /gallery' }),
      ],
    }),
  ],
})

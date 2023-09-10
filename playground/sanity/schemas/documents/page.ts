import {defineArrayMember, defineField, defineType} from 'sanity'

export const pageSchema = defineType({
  name: 'page',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      type: 'localeString',
      title: 'Title (Open Graph)',
      group: 'seo',
      name: 'seoTitle',
      description: 'Used for Open Graph previews implemented  by facebook, twitter, google etc.',
    }),
    defineField({
      type: 'object',
      name: 'gallery',
      fields: [
        defineField({
          type: 'localeString',
          name: 'sectionTitle',
        }),
        defineField({
          type: 'array',
          name: 'slides',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'slide',
              fields: [
                {
                  type: 'localeString',
                  name: 'title',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      type: 'array',
      name: 'sections',
      group: 'content',
      of: [
        defineField({
          type: 'object',
          name: 'gallerySection',
          fields: [
            defineField({
              type: 'localeString',
              name: 'sectionTitle',
            }),
            defineField({
              type: 'array',
              name: 'slides',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'slide',
                  fields: [
                    defineField({
                      type: 'localeString',
                      name: 'title',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        defineField({
          type: 'object',
          name: 'textSection',
          fields: [
            defineField({
              type: 'localeString',
              name: 'title',
            }),
          ],
        }),
      ],
    }),
  ],
})

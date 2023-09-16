import {defineArrayMember, defineField, defineType} from 'sanity'

type Page = any
export const pageSchema: Page = defineType({
  name: 'page',
  type: 'document',
  groups: [
    {
      title: 'Content',
      name: 'content',
      default: true,
    },
    {
      title: 'SEO',
      name: 'seo',
    },
  ],
  fields: [
    defineField({
      type: 'localeString',
      title: 'Title (Open Graph)',
      group: 'seo',
      name: 'seoSuperTitle',
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

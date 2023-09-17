import {Resolver, GeneratorSchemaDefinition} from './../../../../src/types/index'
import {defineArrayMember, defineField, defineType} from 'sanity'

declare module 'sanity' {
  interface BaseSchemaDefinition extends GeneratorSchemaDefinition {}
}

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
      type: 'string',
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
          type: 'array',
          name: 'slides',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'slide',
              fields: [
                {
                  type: 'string',
                  name: 'SUUPER',
                  generator: {
                    resolver: (name) => /* groq */`"${name}": {"super": "cool"}`,
                  },
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
                      name: 'slideTitle',

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
        defineField({
          type: 'object',
          name: 'featuresSection',
          fields: [
            defineField({
              type: 'localeString',
              name: 'title',
            }),
            defineField({
              type: 'localeString',
              name: 'subtitle',
            }),
          ],
        }),
      ],
    }),
  ],
})

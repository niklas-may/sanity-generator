import {defineArrayMember, defineField, defineType} from 'sanity'
import {header} from '../factories'
import {title} from 'process'

type Page = any
export const pageSchema: Page = defineType({
  name: 'page',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
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
      name: 'seoTitle',
      description: 'Used for Open Graph previews implemented  by facebook, twitter, google etc.',
      generator: {
        resolver: (name) => /* groq */ `
          "${name}": {
            "germanTitle": ${name}.de,
            "englishTitle": ${name}.en
          }
        `,
      },
    }),
    header('pageHeader', 'content'),
    defineField({
      type: 'object',
      name: 'gallery',
      group: 'content',

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
                  name: 'image',
                  type: 'image',
                }),
                {
                  type: 'string',
                  name: 'title',
                  generator: {
                    resolver: (name) => /* groq */ `"${name}": {"super": "cool"}`,
                  },
                },
              ],
              preview: {
                select: {
                  title: 'title',
                  image: "image"
                },
                prepare(props) {
                  return {
                    title: props.title,
                    media: props.image
                  }
                },
              },
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

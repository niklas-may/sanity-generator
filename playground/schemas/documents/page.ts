import { defineField, defineType} from 'sanity'
import {headerFactory, mediaFactory} from '../factories'

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
    headerFactory('pageHeader', 'content'),
    mediaFactory("featuredImage", 'content', {video: false}),
    defineField({
      type: 'localeString',
      name: 'seoTitle',
      group: 'seo',
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
              of: [mediaFactory('slide')],
            }),
          ],
          preview: {
            prepare() {
              return {
                title: 'Gallery Section',
              }
            },
          },
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
          preview: {
            prepare() {
              return {
                title: 'Text Section',
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'pageHeader.title',
    },
    prepare(props) {
      return {
        title: props.title,
      }
    },
  },
})

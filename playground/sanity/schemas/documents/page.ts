export const pageSchema = {
  name: 'page',
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
    {
      type: 'localeString',
      title: 'Title (Open Graph)',
      group: 'seo',
      name: 'seoTitle',
      description: 'Used for Open Graph previews implemented  by facebook, twitter, google etc.',
    },

    {
      type: 'array',
      name: 'sections',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'gallerySection',
          fields: [
            {
              type: 'localeString',
              name: 'sectionTitle',
            },
            {
              type: 'array',
              name: 'slides',
              of: [
                {
                  type: 'object',
                  name: 'slide',
                  fields: [
                    {
                      type: 'localeString',
                      name: 'title',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'object',
          name: 'textSection',
          fields: [
            {
              type: 'localeString',
              name: 'title',
            },
          ],
        },
      ],
    },
  ],

  type: 'document',
}

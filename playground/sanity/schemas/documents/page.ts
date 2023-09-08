export const pageSchema = {
  name: "page",
  groups: [
    {
      name: "content",
      title: "Content",
      default: true,
    },
    {
      name: "seo",
      title: "SEO",
    },
  ],
  fields: [
    {
      type: "string",
      name: "pageTitle",
    },
    {
      type: "localeString",
      title: "Title (Open Graph)",
      group: "seo",
      name: "seoTitle",
      description: "Used for Open Graph previews implemented  by facebook, twitter, google etc.",
    },
    {
      title: "Description (Open Graph)",
      name: "seoDescription",
      type: "string",
      group: "seo",
    },
    {
      name: "seoKeywords",
      type: "array",
      group: "seo",
      options: {
        layout: "tags",
      },
      of: [
        {
          name: "keyword",
          type: "string",
        },
      ],
    },
    {
      name: "seoShareImage",
      title: "Image (Open Graph)",
      group: "seo",
      description: "1200x630px recommended",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      type: "text",
      group: "content",
      name: "description",
    },
    {
      name: "featuredMedia",
      type: "media",
      group: "seo",
    },
    {
      type: "array",
      name: "sections",
      group: "content",
      of: [
        {
          type: "object",
          name: "gallerySection",
          fields: [
            {
              type: "array",
              name: "slides",
              of: [
                {
                  type: "object",
                  name: "slide",
                  fields: [
                    {
                      type: "localeString",
                      name: "title",
                    },
                    {
                      name: "media",
                      type: "media",
                    },
                    {
                      name: "caption",
                      type: "string",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  type: "document",
};

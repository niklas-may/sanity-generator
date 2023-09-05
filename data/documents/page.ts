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
                      type: "object",
                      name: "media",
                      fields: [
                        {
                          type: "string",
                          name: "type",
                          title: "Type",
                          options: {
                            list: ["image", "video"],
                            layout: "radio",
                            direction: "horizontal",
                          },
                          initialValue: "image",
                        },
                        {
                          name: "mood",
                          title: "Mood Video",
                          description: "Automatic playback without audio. Videos should be max. 10 seconds long.",
                          type: "file",
                        },
                        {
                          name: "player",
                          title: "Video Player",
                          description:
                            "Video Player with all playback controls. If combined with a mood video, the mood video will replace the image poster.",
                          type: "file",
                        },
                        {
                          name: "image",
                          type: "image",
                          options: {
                            hotspot: true,
                          },
                        },
                      ],
                      preview: {
                        select: {
                          type: "type",
                          mood: "mood.asset.playbackId",
                          player: "player.asset.playbackId",
                          image: "image",
                        },
                      },
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

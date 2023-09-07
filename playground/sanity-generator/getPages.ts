export const getPages = /* groq */ `
*[_type == "page"] {
  ...,
  "seoTitle": coalesce(seoTitle[$lang], seoTitle.en),
  "featuredMedia": {
    _type,
    type == "image" => {
      "image": image.asset-> {
        url,
        "lqip": metadata.lqip,
        "ratio": metadata.dimensions.aspectRatio
      },
      hotspot,
      crop
    },
    type == "video" => {
      "player": player.asset-> {
        "playbackId": playbackId,
        "ratio": data.aspect_ratio,
        thumbTime
      },
      "mood": mood.asset-> {
        "playbackId": playbackId,
        "ratio": data.aspect_ratio
      }
    }
  },
  sections[] {
    ...,
    gallerySection {
      ...,
      slides[] {
        ...,
        slide {
          ...,
          "title": coalesce(title[$lang], title.en),
          "media": {
            _type,
            type == "image" => {
              "image": image.asset-> {
                url,
                "lqip": metadata.lqip,
                "ratio": metadata.dimensions.aspectRatio
              },
              hotspot,
              crop
            },
            type == "video" => {
              "player": player.asset-> {
                "playbackId": playbackId,
                "ratio": data.aspect_ratio,
                thumbTime
              },
              "mood": mood.asset-> {
                "playbackId": playbackId,
                "ratio": data.aspect_ratio
              }
            }
          }
        }
      }
    }
  }
}
`;

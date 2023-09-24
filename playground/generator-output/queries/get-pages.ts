export const getPages = /* groq */ `
*[_type == "page"] {
  ...,
  "pageHeader": {
    "title": pageHeader.title,
    "subtitle": pageHeader.subtitle
  },
  featuredImage {
    _type,
    type,
    type == "image" => {
      image {
        "title": asset->.title,
        "altText": asset->.altText,
        "src": asset->.url,
        "metaData": {
          "crop": crop,
          "hotspot": hotspot,
          "width": asset->.metadata.dimensions.width,
          "height": asset->.metadata.dimensions.height
        }
      }
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
  "seoTitle": coalesce(seoTitle[$lang], seoTitle.en),
  sections[] {
    ...,
    _type == "gallerySection" => {
      ...,
      "sectionTitle": coalesce(sectionTitle[$lang], sectionTitle.en),
      slides[] {
        ...,
        _type,
        type,
        type == "image" => {
          image {
            "title": asset->.title,
            "altText": asset->.altText,
            "src": asset->.url,
            "metaData": {
              "crop": crop,
              "hotspot": hotspot,
              "width": asset->.metadata.dimensions.width,
              "height": asset->.metadata.dimensions.height
            }
          }
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
    },
    _type == "textSection" => {
      ...,
      "title": coalesce(title[$lang], title.en)
    }
  }
}[0]
`;

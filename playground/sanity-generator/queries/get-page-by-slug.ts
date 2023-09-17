export const getPageBySlug = /* groq */ `
*[_type == "page" && slug.current == $slug] {
  ...,
  "seoTitle": {
    "germanTitle": seoTitle.de,
    "englishTitle": seoTitle.en
  },
  gallery {
    ...,
    "sectionTitle": coalesce(sectionTitle[$lang], sectionTitle.en),
    slides[] {
      ...,
      "title": {
        "super": "cool"
      }
    }
  },
  sections[] {
    _type == "gallerySection" => {
      ...,
      "sectionTitle": coalesce(sectionTitle[$lang], sectionTitle.en),
      slides[] {
        ...,
        "title": coalesce(title[$lang], title.en)
      }
    },
    _type == "textSection" => {
      ...,
      "title": coalesce(title[$lang], title.en)
    },
    _type == "featuresSection" => {
      ...,
      "title": coalesce(title[$lang], title.en),
      "subtitle": coalesce(subtitle[$lang], subtitle.en)
    }
  }
}[0]
`;

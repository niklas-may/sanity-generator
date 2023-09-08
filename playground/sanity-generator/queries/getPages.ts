export const getPages = /* groq */ `
*[_type == "page"] {
  ...,
  "seoTitle": coalesce(seoTitle[$lang], seoTitle.en),
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
    }
  }
}
`;

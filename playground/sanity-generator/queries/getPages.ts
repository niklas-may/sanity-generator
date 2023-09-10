import { localeString } from "../resolver";

export const getPages = /* groq */ `
*[_type == "page"] {
  ...,
  ${localeString("seoTitle")},
  gallery {
    ...,
    ${localeString("sectionTitle")},
    slides[] {
      ...,
      ${localeString("title")}
    }
  },
  sections[] {
    _type == "gallerySection" => {
      ...,
      ${localeString("sectionTitle")},
      slides[] {
        ...,
        ${localeString("title")}
      }
    },
    _type == "textSection" => {
      ...,
      ${localeString("title")}
    }
  }
}[0]
`;

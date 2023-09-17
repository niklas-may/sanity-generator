import { localeString } from "../resolver";

export const getPages = /* groq */ `
*[_type == "page"] {
  ...,
  ${localeString("seoTitle")},
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
    },
    _type == "featuresSection" => {
      ...,
      ${localeString("title")},
      ${localeString("subtitle")}
    }
  }
}[0]
`;

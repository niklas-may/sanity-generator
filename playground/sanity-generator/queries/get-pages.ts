import { inlineResolver0, localeString } from "../resolver";

export const getPages = /* groq */ `
*[_type == "page"] {
  ...,
  gallery {
    ...,
    slides[] {
      ...,
      ${inlineResolver0("SUUPER")}
    }
  },
  sections[] {
    _type == "gallerySection" => {
      ...,
      ${localeString("sectionTitle")},
      slides[] {
        ...,
        ${localeString("slideTitle")}
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

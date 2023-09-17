import { inlineResolver0, localeString, inlineResolver1 } from "../resolver";

export const getPageBySlug = /* groq */ `
*[_type == "page" && slug.current == $slug] {
  ...,
  ${inlineResolver0("seoTitle")},
  gallery {
    ...,
    ${localeString("sectionTitle")},
    slides[] {
      ...,
      ${inlineResolver1("title")}
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
    },
    _type == "featuresSection" => {
      ...,
      ${localeString("title")},
      ${localeString("subtitle")}
    }
  }
}[0]
`;

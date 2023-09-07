import { localeString, media } from "../resolver";

export const getPageBySlug = /* groq */ `
*[_type == "page" && slug == $slug] {
  ...,
  ${localeString("seoTitle")},
  ${media("featuredMedia")},
  sections[] {
    ...,
    gallerySection {
      ...,
      slides[] {
        ...,
        slide {
          ...,
          ${localeString("title")},
          ${media("media")}
        }
      }
    }
  }
}[0]
`;

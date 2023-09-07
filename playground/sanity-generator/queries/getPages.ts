import { localeString, media } from "../resolver";

export const getPages = /* groq */ `
*[_type == "page"] {
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
}
`;

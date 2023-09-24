import {
  inlineResolver0,
  inlineResolver1,
  localeString,
  inlineResolver2,
} from "../resolver";

// prettier-ignore
export const getPageBySlug = /* groq */`
*[_type == "page" && slug.current == $slug] { ..., ${inlineResolver0("seoTitle")}, ${inlineResolver1("pageHeader")}, gallery { ..., ${localeString("sectionTitle")}, slides[] { ..., slide { ..., ${inlineResolver2("title")} } } }, sections[] { ..., gallerySection { ..., ${localeString("sectionTitle")}, slides[] { ..., slide { ..., ${localeString("title")} } } }, textSection { ..., ${localeString("title")} }, featuresSection { ..., ${localeString("title")}, ${localeString("subtitle")} } } }[0] `

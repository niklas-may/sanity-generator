import { inlineResolver0, localeString, inlineResolver1 } from "../resolver";

// prettier-ignore
export const getPages = /* groq */`
*[_type == "page"] { ..., ${inlineResolver0("seoTitle")}, gallery { ..., ${localeString("sectionTitle")}, slides[] { ..., slide { ..., ${inlineResolver1("title")} } } }, sections[] { ..., gallerySection { ..., ${localeString("sectionTitle")}, slides[] { ..., slide { ..., ${localeString("title")} } } }, textSection { ..., ${localeString("title")} }, featuresSection { ..., ${localeString("title")}, ${localeString("subtitle")} } } }[0] `

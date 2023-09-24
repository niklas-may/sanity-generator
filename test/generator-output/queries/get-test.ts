import {
  inlineResolver0,
  specialNumber,
  localeString,
  inlineResolver1,
} from "../resolver";

// prettier-ignore
export const getTest = /* groq */`
*[_id == "0cccfcd0-c69d-4832-9929-63ff2c6e2b58"] { ..., ${inlineResolver0("primitiveFactory")}, ${specialNumber("customPrimitive")}, ${localeString("customComplex")}, ${inlineResolver1("complexFactory")}, arrayMultipleTypes[] { ..., _type == "customComplex" => { ${localeString("customComplex")} }, _type == "complexFactory" => { ${inlineResolver1("complexFactory")} } }, arraySlingleType[] { ..., ${specialNumber("customPrimitive")} }, arraySlingleComplextType[] { ..., ${localeString("customComplex")} }, object { ..., ${specialNumber("customPrimitive")}, ${localeString("customComplex")}, ${inlineResolver0("primitiveFactory")}, ${inlineResolver1("complexFactory")} } }[0] `

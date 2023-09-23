export const getTest = /* groq */ `
*[_id == "0cccfcd0-c69d-4832-9929-63ff2c6e2b58"] {
  ...,
  "primitiveFactory-wrapped": primitiveFactory,
  "customPrimitive-special-number": customPrimitive,
  "customComplex": coalesce(customComplex[$lang], customComplex.en),
  "complexFactory-wrapped": {
    "title": complexFactory.title,
    "subtitle": complexFactory.subtitle
  },
  arrayMultipleTypes[] {
    ...,
    _type == "customComplex" => {
      "customComplex": coalesce(customComplex[$lang], customComplex.en)
    },
    _type == "complexFactory" => {
      "complexFactory-wrapped": {
        "title": complexFactory.title,
        "subtitle": complexFactory.subtitle
      }
    }
  },
  arraySlingleType[] {
    ...,
    "customPrimitive-special-number": customPrimitive
  },
  arraySlingleComplextType[] {
    ...,
    "customComplex": coalesce(customComplex[$lang], customComplex.en)
  },
  object {
    ...,
    "customPrimitive-special-number": customPrimitive,
    "customComplex": coalesce(customComplex[$lang], customComplex.en),
    "primitiveFactory-wrapped": primitiveFactory,
    "complexFactory-wrapped": {
      "title": complexFactory.title,
      "subtitle": complexFactory.subtitle
    }
  }
}[0]
`;

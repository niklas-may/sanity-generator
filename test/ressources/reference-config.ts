export default {
  queries: {
    getTest: /* groq */ `
    *[_id == "0cccfcd0-c69d-4832-9929-63ff2c6e2b58"] {
        ...,
        "complexFactory-wrapped": {
          "title": complexFactory.title,
          "subtitle": complexFactory.subtitle
        },
        "customPrimitive-special-number": customPrimitive,
        "customComplex": coalesce(customComplex[$lang], customComplex.en),
        "primitiveFactory-wrapped": primitiveFactory,
        arrayMultipleTypes[] {
          _type == "builtInComplex" => {
            ...
          },
          _type == "customComplex" => {
            ...,
            "customComplex": coalesce(customComplex[$lang], customComplex.en),
          },
          _type == "complexFactory" => {
            ...,
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
          "complexFactory-wrapped": {
            "title": complexFactory.title,
            "subtitle": complexFactory.subtitle
          },
          "primitiveFactory-wrapped": primitiveFactory, 
        }
      }[0]
    `,
  },
};

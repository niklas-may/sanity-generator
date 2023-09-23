export const testReferenzeQuery = /* groq */`
    *[_id == "0cccfcd0-c69d-4832-9929-63ff2c6e2b58"] {
        builtInString,
        builtInComplex,
        "customPrimitive-special-number": customPrimitive,
        "customComplex": coalesce(customComplex[$lang], customComplex.en),
        "primitiveFactory-wrapped": primitiveFactory,
        "complexFactory-wrapped": {
            "title": complexFactory.title,
            "subtitle": complexFactory.subtitle
        }
    }

`
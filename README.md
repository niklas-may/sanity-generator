
# Sanity Generator

A codegen tool for [Sanity](https://www.sanity.io) to autogenerate GROQ queries.

*Currently in beta status.*

## Minamal Config

Sanity Generator works from a schema first perspective. For aminimal config, you need to specify all documents schemas and define their corresponding queries. 

```TypeScript
// sanity-generator.config.ts
export default createConfig({
  documents: {
    page: pageSchema,
  },
  createQueries: {
    getPages: (documents) => /* groq */ `
        *[_type == "${documents.page.type}"] {
          ${documents.page.groq}
        }
      `,
  },
});
```

If you run `$ yarn sanity-generate`, you just get a query with a "naked projection".

```TypeScript
// sanity-generator/queries/getPages.ts
export const getPages = /* groq */ `
*[_type == "page"] {
    ...
}
`
```

## Resolve Types (aka. the actual use case)
You can specify resolver, which is a function that returns a GROQ projection, for field types that exist in the sanity schema.

```TypeScript
//sanity-generator.config.ts
export default createConfig({
  documents: {
    page: pageSchema,
  },
  resolveTypes: {
    // Resolve all field types of "localString" with this projection...
    localeString: (name: string) => /* groq */ `
        "${name}": coalesce(${name}[$lang], ${name}.en)
    `,
  },
  createQueries: {
    getPages: (documents) => /* groq */ `
        *[_type == "${documents.page.type}"] {
          ${documents.page.groq}
        }
      `,
  },
});
```
If you now run `$ yarn sanity-generate`, the projection will expanded to reach all types that have a custom resolver.

```TypeScript
// sanity-generator/queries/getPages.ts
export const getPages = /* groq */  `
*[_type == "page"] {
  ...,
  "seoTitle": coalesce(seoTitle[$lang], seoTitle.en),
  sections[] {
    ...,
    gallerySection {
      ...,
      slides[] {
        ...,
        slide {
          ...,
          "title": coalesce(title[$lang], title.en)
        }
      }
    }
  }
}

`
```

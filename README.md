
# Sanity Generator

Sanity Generator is a codegen tool for [Sanity](https://www.sanity.io) to automatically generate GROQ queries from a schema perspective.

**Note: Currently in beta. Be cautious when using it in production.**

## Minimal Configuration

To get started, define your document schemas and queries like this:
 
```TypeScript
// sanity-generator.config.ts
export default createConfig({
  schemas: {
    page: pageSchema,
  },
  queries: {
    getPages: ({ schemas }) => /* groq */ `
        *[_type == "${schemas.page.name}"] {
          ${schemas.page.projection}
        }
      `,
  },
});
```

When you run `$ npx sanity-generator`, it creates queries with a spread operator to return all fields. 

```TypeScript
// sanity-generator/queries/getPages.ts
export const getPages = /* groq */ `
*[_type == "page"] {
    ...
}
`
```

## Resolver for Custom Types (aka.  the actual use case)

Define resolvers for field types from your Sanity schema. These resolvers are functions that return custom GROQ projections:

```TypeScript
// sanity-generator.config.ts
export default createConfig({
  schemas: {
    page: pageSchema,
  },
  resolvers: {
    // Resolve all field types of "localString" with this projection...
    localeString: (name: string) => /* groq */ `
      "${name}": coalesce(${name}[$lang], ${name}.en)
    `,
  },
  queries: {
    getPages: ({ schemas }) => /* groq */ `
        *[_type == "${schemas.page.name}"] {
          ${schemas.page.projection}
        }
      `,
  },
});
```

If you run `$ npx sanity-generator` now, it expands the projection to transform all types with their associated resolver:

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

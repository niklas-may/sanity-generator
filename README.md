# Sanity Generator

Sanity Generator aims to simplify the process of defining schemas and queries when working with [Sanity](https://www.sanity.io/) CMS.

It is based on the assumption that a given document schema shape, is not that different from its corresponding query shape. Moreover, it assumes that if you need to reshape a specific field type, you probably would like to do this on all occurrences of that type throughout all queries.

Certainly, this can be done with simple exporting, importing, and composing of template literals. But this is quite repetitive and error-prone. Sanity Generator is a CLI tool that aims to automate this while still providing all the flexiblities of GROQ.

**Disclaimer: This is still Beta. Use with caution**

## Basic Usage

Install from npm:

`$ npm install sanity-generator --save-dev`

`$ yarn add sanity-generator --dev`

Create a config file:

`$ npx sanity-generator init`

Customize the config:

```TypeScript
// sanity-generator.config.ts
export default createConfig({
  schemas: {
    // All sanity document schemas you want to query go here.
    // The object key is for later referencing.
    page: pageSchema,
  },
  resolvers: {
    // All field types you want to apply a custom GROQ query go here.
    // The object key must match a field type.
    localeString: (name: string) => /* groq */ `
      "${name}": coalesce(${name}[$lang], ${name}.en)
    `,
  },
  queries: {
    // Every property in here will be exported as a GROQ query. 
    // The function receives a single argument that is an object with 
    // all processed schemas. Here you can get the projection with 
    // all resolvers applied, and for convenience also the schema name.
    getPages: ({ schemas }) => /* groq */ `
        *[_type == "${schemas.page.name}"] {
          ${schemas.page.projection}
        }
      `,
  },
});
```

## How it works

Sanity Generator simply traverses all branches of the document schema. If a branch holds no types that have a corresponding resolver, it uses the spread operator (`...`). If a branch holds a type that should be resolved differently, it writes the corresponding projections just as far as needed.

Here is an example with the same query, without and with a custom resolver. (Both with option `inlineResolver: true`) 

```TypeScript
// Generated query with no resolver
export const getPages = /* groq */ `
*[_type == "page"] {
    ...
}
`
```

```TypeScript
// Same query, with resolver
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
        "title": coalesce(title[$lang], title.en)
      }
    }
  }
}
`
```

## Options

### CLI

`$ npx sanity-generator`

or

`$ npx sg`

| Command    | Option             | Description                                                                        |
| ---------- | ------------------ | ---------------------------------------------------------------------------------- |
| `generate` |                    | Run the generator assuming the config is here: `~/sanity-generator.config.ts` |
| `generate` | `--config` `-c` | Specify a path to the config file                                                  |
| `init`     |                    | Create a default config                                                            |

### Config

The module exports a `createConfig` function to provide better type support for the configuration object.

| Property        | Default              | Description                                                                                                                                        |
| --------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| schemas         | {}                   | See basic usage                                                                                                                                    |
| resolvers       | {}                   | See basic usage                                                                                                                                    |
| queries         | {}                   | See basic usage                                                                                                                                    |
| outPath         | './sanity-generator` | Path to the destination folder for the queries                                                                                                     |
| inlineResolvers | false                | By default, resolvers are imported as a function into the final query. Setting this to false, will inline the resolvers as a string into the query. |

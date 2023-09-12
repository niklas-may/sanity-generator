# Sanity Generator

Sanity Generator aims to simplify the process of defining schemas and queries when working with [Sanity](https://www.sanity.io/) CMS.

It is built on the premise, that for most use cases, the shape of your query can be very similar to the shape of your document schema. Moreover, it assumes that if you need to reshape a specific field type, you probably would like to do this on all occurrences of that type throughout all queries.

Certainly, this can be done with simple exporting, importing, and composing of template literals. But this is quite repetitive and error-prone. Sanity Generator is a CLI tool that aims to automate this while still providing all the flexiblities of GROQ.

**Disclaimer: This is still Beta. Use with caution**

## Basic Usage

Install from npm:

```sh 
npm install sanity-generator --save-dev
```
or

```sh
yarn add sanity-generator --dev
```

Create a config file:

```sh
npx sanity-generator init
```

Customize the config:

```js
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

Write the queries and resolver to disk:

```sh 
npx sanity-generator generate
```

## Filehandling and Limitations

Sanity Generator uses [ts-node](https://github.com/TypeStrong/ts-node) and if present the tsconfig.json from the present working directory to transpile all TypeScript dependencies of your config. However, this might not be enough if your schemas depend on files that need a special loader like css files. For these scenarios you might need to transpile the schemas before using them with the generator.

## Programatic Use

For szenarios as described before or more custom implementation, you can import the core functins to your node.js app.

```js
import { createConfig, generate } from "sanity-generator";

const config = createConfig({
  // ...config
})

generate(...config)

```
 
## How it works

Sanity Generator simply traverses all branches of the document schema. If a branch holds no types that have a corresponding resolver, it uses the spread operator (`...`). If a branch holds a type that should be resolved differently, it writes the corresponding projections just as far as needed.

Here is an example with the same query, without and with a custom resolver. (Both with option `inlineResolver: true`) 

```js
// Generated query with no resolver
export const getPages = /* groq */ `
*[_type == "page"] {
    ...
}
`
```

```js
// Same query, with resolver
export const getPages = /* groq */  `
*[_type == "page"] {
  ...,
  "seoTitle": coalesce(seoTitle[$lang], seoTitle.en),
  sections[] {
    ...,
    slides[] {
      ...,
      "title": coalesce(title[$lang], title.en)
    }
  }
}
`
```

## Options

### CLI

```sh
npx sanity-generator
```

or

```sh
npx sg
```

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

## ToDos
[] Example for programatic use in monorepo (PRs welcome)

## Roadmat
[] Auto type generation for the queries.
[] Local resolvers for inline objects (Objects that are note importet directyl to the schema)
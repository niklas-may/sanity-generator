import {GeneratorSchemaDefinition} from 'sanity-generator/types'
export {}

declare module 'sanity' {
  interface FieldDefinitionBase extends GeneratorSchemaDefinition {}
}

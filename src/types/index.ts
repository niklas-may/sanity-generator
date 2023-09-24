export type DocumentOrField = {
  name: string;
  type: string;
  of?: DocumentOrField[];
  fields?: DocumentOrField[];
  generator?: {
    resolver: Resolver;
  };
  [key: string]: any;
};

export type ProcessedSchema = {
  name: string;
  projection: string;
};

type SanitySchemas = Record<string, DocumentOrField>;

export type Resolver = (fieldName: string) => string;

export type Config<T extends SanitySchemas> = {
  schemas: T;
  queries: QueriesConfig<T>;
  resolvers?: Record<string, Resolver>;
};

export type QueriesConfig<T extends object> = Record<
  string,
  (ctx: { schemas: Record<keyof T, ProcessedSchema> }) => string
>;

export type CreateConfigReturn<T extends Record<string, any>> = [Config<T>, Options?];

export type Options = {
  outPath?: string;
  inlineResolver?: boolean;
  trim?: boolean
};

export interface GeneratorSchemaDefinition {
  generator?: {
    resolver?: Resolver;
  };
}

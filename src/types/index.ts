export type Field = {
  name: string;
  type: string;
  of?: Field[];
  fields?: Field[];
};

export type ProcessedSchema = {
  name: string;
  projection: string;
};

type CreateProjections = object;

export type Resolver = (fieldName: string) => string;

export type Config<T extends CreateProjections> = {
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
  inlineResolver?: boolean
};


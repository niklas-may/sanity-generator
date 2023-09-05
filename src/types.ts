export type Field = {
  name: string;
  type: string;
  of?: Field[];
  fields?: Field[];
};

export type Projection = {
  type: string;
  groq: string;
};

type CreateProjections = object;

export type TypeProjection = (fieldName: string) => string;

export type Config<T extends CreateProjections> = {
  documents: T;
  createQueries: CreateQueries<T>;
  resolveTypes?: Record<string, TypeProjection>;
};

export type CreateQueries<T extends object> = Record<string, (ctx: Record<keyof T, Projection>) => string>;

export type CreateConfigReturn<T extends Record<string, any>> = Config<T>;

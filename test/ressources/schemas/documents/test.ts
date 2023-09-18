import { primitiveFactory } from "./../factories/primtive";
import { complexFactory } from "./../factories/complex";

export const testDocumentSchema = {
  name: "test",
  type: "document",
  /**
   * 1 First level document fields with:
   * 1.1)   Sanity built-in types
   *        - Primitive filed type
   *        - Complex field type
   * 1.2)   Custom types with Resolver
   *        - Primtive
   *        - Coplex
   * 1.3)   Inline Rsolver
   *        - Primitive
   *        - Complex
   */
  fields: [
    /**
     * 1.1
     */
    {
      name: "builtInString",
      type: "string",
    },
    {
      name: "builtInComplex",
      type: "image",
    },
    /**
     * 1.2
     */
    {
      name: "customPrimitive",
      type: "specialNumber",
    },
    {
      name: "customComplex",
      type: "localeString",
    },
    /**
     * 1.3
     */
    primitiveFactory("primitiveFactory"),
    complexFactory("complexFactory"),
  ],
};

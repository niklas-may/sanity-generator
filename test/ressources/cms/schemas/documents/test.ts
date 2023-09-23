import {primitiveFactory} from './../factories/primtive'
import {complexFactory} from './../factories/complex'

export const testDocumentSchema = {
  name: 'test',
  type: 'document',
  /**
   * 1) First level document fields with:
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
    {
      name: 'builtInString',
      type: 'string',
    },
    {
      name: 'builtInComplex',
      type: 'image',
    },

    {
      name: 'customPrimitive',
      type: 'specialNumber',
    },
    {
      name: 'customComplex',
      type: 'localeString',
    },

    primitiveFactory('primitiveFactory'),
    complexFactory('complexFactory'),

    /**
     * 2) Second level array multiple types:
     * 2.1) Built-in complex
     * 2.2) Custom global complex
     * 2.3) Inline complex
     */
    {
      type: 'array',
      name: 'arrayMultipleTypes',
      of: [
        {
          name: 'builtInComplex',
          type: 'image',
        },
        {
          name: 'customComplex',
          type: 'localeString',
        },
        complexFactory('complexFactory'),
      ],
    },
    /**
     * 3) Second level array one type:
     */
    {
      type: 'array',
      name: 'arraySlingleType',
      of: [
        {
          name: 'customPrimitive',
          type: 'specialNumber',
        },
      ],
    },
    /**
     * 3) Second level array one type:
     */
    {
      type: 'array',
      name: 'arraySlingleComplextType',
      of: [
        {
          name: 'customComplex',
          type: 'localeString',
        },
      ],
    },
    /**
     * 5) Second level array multiple types:
     * 5.1)   Sanity built-in types
     *        - Primitive filed type
     *        - Complex field type
     * 5.2)   Custom types with Resolver
     *        - Primtive
     *        - Coplex
     * 5.3)   Inline Rsolver
     *        - Primitive
     *        - Complex
     */
    {
      type: 'object',
      name: 'object',
      fields: [
        {
          name: 'builtInString',
          type: 'string',
        },
        {
          name: 'builtInComplex',
          type: 'image',
        },

        {
          name: 'customPrimitive',
          type: 'specialNumber',
        },
        {
          name: 'customComplex',
          type: 'localeString',
        },

        primitiveFactory('primitiveFactory'),
        complexFactory('complexFactory'),
      ],
    },
  ],
}

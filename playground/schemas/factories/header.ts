import {defineField} from 'sanity'

export const header = (name: string, group = "") =>
  defineField({
    type: 'object',
    name,
    group,
    fields: [
      {name: 'title', type: 'string'},
      {name: 'subtitle', type: 'string'},
    ],
    generator: {
      resolver: (name: string) => /* groq */ `
            "${name}-wrapped": {
              "title": ${name}.title,
              "subtitle": ${name}.subtitle
            }
        `,
    },
  })

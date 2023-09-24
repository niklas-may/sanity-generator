import {Resolver} from './../../../src/types/index'
import {defineField} from 'sanity'

export function headerFactory(name: string, group = '') {
  return defineField({
    type: 'object',
    name,
    group,
    fields: [
      {name: 'title', type: 'string'},
      {name: 'subtitle', type: 'string'},
    ],
    generator: {
      resolver,
    },
  })
}

const resolver: Resolver = (name: string) => /* groq */ `
"${name}": {
  "title": ${name}.title,
  "subtitle": ${name}.subtitle
}
`

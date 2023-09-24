import type {Resolver} from 'sanity-generator/types'

export const specialNumberSchema = {
  type: 'number',
  name: 'specialNumber',
}

export const specialNumberResolver: Resolver = (name: string) => /* groq */ `
    "${name}-special-number": ${name}
`

const localizedTextObjectSchema = {
  type: 'object',
  properties: {
    en: {type: 'string'},
  },
  additionalProperties: {type: 'string'},
  required: ['en'],
} as const

export const localizedTextSchema = {
  oneOf: [
    {type: 'string'},
    localizedTextObjectSchema,
  ],
} as const

export type LocalizedText = string | {en: string, [key: string]: string}

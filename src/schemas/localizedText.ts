const localizedTextObjectSchema = {
  type: 'object',
  properties: {
    en: {type: 'string'},
  },
  additionalProperties: {type: 'string'},
  required: ['en'],
}

export const localizedTextSchema = {
  oneOf: [
    {type: 'string'},
    localizedTextObjectSchema,
  ],
}

export type LocalizedText = string | {en: string, [key: string]: string}

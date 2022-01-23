import { FromSchema } from 'json-schema-to-ts'

import { fsSchema } from './fs'

export const mediaStorageSchema = {
  oneOf: [fsSchema],
} as const

export type MediaStorageConfig = FromSchema<typeof mediaStorageSchema>

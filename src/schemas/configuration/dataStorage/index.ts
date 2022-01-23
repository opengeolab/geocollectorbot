import { FromSchema } from 'json-schema-to-ts'

import { pgSchema } from './pg'

export const dataStorageSchema = {
  oneOf: [pgSchema],
} as const

export type DataStorageConfig = FromSchema<typeof dataStorageSchema>

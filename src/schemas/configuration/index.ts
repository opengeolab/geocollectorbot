import {FromSchema} from 'json-schema-to-ts'

import {dataStorageSchema} from './dataStorage'
import {flowSchema} from './flow'

export const configurationSchema = {
  type: 'object',
  properties: {
    flow: flowSchema,
    dataStorage: dataStorageSchema,
  },
  additionalProperties: false,
  required: ['flow', 'dataStorage'],
} as const

export type RawConfiguration = FromSchema<typeof configurationSchema>

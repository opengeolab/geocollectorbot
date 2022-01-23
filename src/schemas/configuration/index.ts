import { FromSchema } from 'json-schema-to-ts'

import { dataStorageSchema } from './dataStorage'
import { flowSchema, RawFlow } from './flow'
import { mediaStorageSchema } from './mediaStorage'

export const configurationSchema = {
  type: 'object',
  properties: {
    flow: flowSchema,
    dataStorage: dataStorageSchema,
    mediaStorage: mediaStorageSchema,
  },
  additionalProperties: false,
  required: ['flow', 'dataStorage'],
} as const

export type RawConfiguration = Omit<FromSchema<typeof configurationSchema>, 'flow'> & { flow: RawFlow }

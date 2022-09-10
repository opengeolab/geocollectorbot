import { FromSchema } from 'json-schema-to-ts'

import { dataStorageSchema } from './dataStorage'
import { flowSchema, RawFlow } from './flow'
import { mediaStorageSchema } from './mediaStorage'

const configurationSchemaForType = {
  type: 'object',
  properties: {
    dataStorage: dataStorageSchema,
    mediaStorage: mediaStorageSchema,
  },
  additionalProperties: false,
  required: ['dataStorage'],
} as const

export const configurationSchema = {
  type: 'object',
  properties: {
    ...configurationSchemaForType.properties,
    flow: flowSchema,
  },
  additionalProperties: false,
  required: [...configurationSchemaForType.required, 'flow'],
}

export type RawConfiguration = FromSchema<typeof configurationSchemaForType> & { flow: RawFlow }

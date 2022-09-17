import { FromSchema } from 'json-schema-to-ts'

import { dataStorageSchema } from './dataStorage'
import { flowSchema, RawFlow } from './flow'
import { mediaStorageSchema } from './mediaStorage'

const settingsSchema = {
  type: 'object',
  properties: {
    includeUserInfoInGetInteractionsApi: {
      description: 'If set to true, user\'s data will be returned by the get interactions api',
      type: 'boolean',
    },
  },
  additionalProperties: false,
} as const

export type RawConfigurationSettings = FromSchema<typeof settingsSchema>

const configurationSchemaForType = {
  type: 'object',
  properties: {
    settings: settingsSchema,
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

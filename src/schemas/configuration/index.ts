import {dataStorageSchema} from './dataStorage'
import {FromSchema} from 'json-schema-to-ts'

export const configurationSchema = {
  type: 'object',
  properties: {
    dataStorage: dataStorageSchema,
  },
  additionalProperties: false,
  required: ['dataStorage'],
} as const

export type Configuration = FromSchema<typeof configurationSchema>

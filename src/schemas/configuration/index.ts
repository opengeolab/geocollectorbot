import {FromSchema} from 'json-schema-to-ts'

import {stepsSchema} from './steps'
import {dataStorageSchema} from './dataStorage'

export const configurationSchema = {
  type: 'object',
  properties: {
    steps: stepsSchema,
    dataStorage: dataStorageSchema,
  },
  additionalProperties: false,
  required: ['steps', 'dataStorage'],
} as const

export type Configuration = FromSchema<typeof configurationSchema>

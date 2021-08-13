import {FromSchema} from 'json-schema-to-ts'

const DEFAULT_PORT = 8080

export const environmentSchema = {
  type: 'object',
  properties: {
    HTTP_PORT: {
      type: 'string',
      default: DEFAULT_PORT,
    },
    LOG_LEVEL: {
      type: 'string',
      enum: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: 'info',
    },
  },
  required: ['HTTP_PORT', 'LOG_LEVEL'],
} as const

export type Environment = FromSchema<typeof environmentSchema>

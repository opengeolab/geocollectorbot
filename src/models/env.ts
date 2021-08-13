import {FromSchema} from 'json-schema-to-ts'

const DEFAULT_PORT = 8080

export const envSchema = {
  type: 'object',
  properties: {
    HTTP_PORT: {
      type: 'string',
      default: DEFAULT_PORT,
    },
  },
} as const

export type EnvVariables = FromSchema<typeof envSchema>

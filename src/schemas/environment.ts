import { FromSchema } from 'json-schema-to-ts'

const DEFAULT_PORT = 8080

export const environmentSchema = {
  type: 'object',
  properties: {
    HTTP_PORT: { type: 'string', default: DEFAULT_PORT },
    LOG_LEVEL: {
      type: 'string',
      enum: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: 'info',
    },
    CONFIGURATION_PATH: { type: 'string' },
    CUSTOM_TRANSLATIONS_FOLDER_PATH: { type: 'string' },
    TELEGRAM_AUTH_TOKEN: { type: 'string' },
  },
  required: ['CONFIGURATION_PATH', 'TELEGRAM_AUTH_TOKEN'],
} as const

export type Environment = FromSchema<typeof environmentSchema> & {
  HTTP_PORT: string
  LOG_LEVEL: string
}

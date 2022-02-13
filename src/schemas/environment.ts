import { FromSchema } from 'json-schema-to-ts'

const DEFAULT_PORT = 8080
const DEFAULT_LOG_LEVEL = 'info'
const DEFAULT_CONFIG_PATH = '/app/config.json'
const CUSTOM_TRANSLATIONS_FOLDER_PATH = '/app/custom_locales'

export const environmentSchema = {
  type: 'object',
  properties: {
    HTTP_PORT: { type: 'string', default: DEFAULT_PORT },
    LOG_LEVEL: {
      type: 'string',
      enum: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: DEFAULT_LOG_LEVEL,
    },
    CONFIGURATION_PATH: { type: 'string', default: DEFAULT_CONFIG_PATH },
    CUSTOM_TRANSLATIONS_FOLDER_PATH: { type: 'string', default: CUSTOM_TRANSLATIONS_FOLDER_PATH },
    TELEGRAM_AUTH_TOKEN: { type: 'string' },
  },
  required: ['HTTP_PORT', 'LOG_LEVEL', 'CONFIGURATION_PATH', 'TELEGRAM_AUTH_TOKEN'],
} as const

export type Environment = FromSchema<typeof environmentSchema>

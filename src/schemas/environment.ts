import { FromSchema } from 'json-schema-to-ts'

const DEFAULT_LOG_LEVEL = 'info'
const DEFAULT_CONFIG_PATH = '/home/node/config.json'
const CUSTOM_TRANSLATIONS_FOLDER_PATH = '/home/node/custom_locales'
const DEFAULT_UPDATE_MODE = 'polling'

export const environmentSchema = {
  type: 'object',
  properties: {
    PORT: { type: 'string' },
    LOG_LEVEL: {
      type: 'string',
      enum: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: DEFAULT_LOG_LEVEL,
    },
    CONFIGURATION_PATH: { type: 'string', default: DEFAULT_CONFIG_PATH },
    CUSTOM_TRANSLATIONS_FOLDER_PATH: { type: 'string', default: CUSTOM_TRANSLATIONS_FOLDER_PATH },
    TELEGRAM_AUTH_TOKEN: { type: 'string' },
    UPDATE_MODE: { type: 'string', enum: ['webhook', 'polling'], default: DEFAULT_UPDATE_MODE },
    PUBLIC_URL: { type: 'string' },
  },
  required: ['LOG_LEVEL', 'CONFIGURATION_PATH', 'TELEGRAM_AUTH_TOKEN', 'UPDATE_MODE'],
} as const

export type Environment = FromSchema<typeof environmentSchema>

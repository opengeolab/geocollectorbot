import {join} from 'path'
import {FastifyLoggerInstance} from 'fastify'

import {Environment} from '../schemas/environment'

export const baseEnv: Environment = {
  HTTP_PORT: 'http_port',
  LOG_LEVEL: 'silent',
  CONFIGURATION_PATH: join(__dirname, '../__mocks__/configmap.json'),
  TELEGRAM_AUTH_TOKEN: 'telegram_auth_token',
}

export const mockLogger: FastifyLoggerInstance = {
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
  warn: jest.fn(),
  child: jest.fn(),
}

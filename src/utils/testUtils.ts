import {join} from 'path'

import {FastifyInstance, FastifyLoggerInstance} from 'fastify'

import {StorageClient} from '../clients/storage'
import {DecoratedContext} from '../models/DecoratedContext'
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

export const getMockStorageClient = (props: Partial<StorageClient> = {}): StorageClient => ({
  createInteraction: props.createInteraction || jest.fn(),
  getOngoingInteractions: props.getOngoingInteractions || jest.fn(),
  updateInteraction: props.updateInteraction || jest.fn(),
  stop: props.stop || jest.fn(),
})

type MockFastifyProps = {
  bot?: Record<string, any>
  storageClient?: Record<string, any>
  i18n?: Record<string, any>
  configuration?: Record<string, any>
}

export const getMockFastify = (props: MockFastifyProps = {}): FastifyInstance => ({
  log: mockLogger,
  env: baseEnv,
  configuration: props.configuration || {},
  i18n: props.i18n || {},
  bot: props.bot || {},
  storageClient: props.storageClient || {},
} as unknown as FastifyInstance)

export type MockContextProps = {
  from?: Record<string, any>
  chat?: Record<string, any>
  update?: Record<string, any>
}

export const getMockContext = (props: MockContextProps = {}): DecoratedContext => ({
  from: props.from,
  chat: props.chat,
  t: jest.fn().mockImplementation(key => `translation_${key}`),
  chatId: 'chat_id',
  update: props.update,
  reply: jest.fn(),
} as unknown as DecoratedContext)

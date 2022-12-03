import { join } from 'path'

import { FastifyInstance, FastifyLoggerInstance } from 'fastify'

import { DataStorageClient } from '../clients/dataStorage'
import { MediaStorageClient } from '../clients/mediaStorage'
import { DecoratedContext } from '../models/DecoratedContext'
import { Environment } from '../schemas/environment'

export const baseEnv: Environment = {
  PORT: 'http_port',
  LOG_LEVEL: 'silent',
  CONFIGURATION_PATH: join(__dirname, '../__mocks__/configmap.json'),
  TELEGRAM_AUTH_TOKEN: 'telegram_auth_token',
  UPDATE_MODE: 'polling',
  GET_MEDIA_BASE_PATH: '/media',
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

export const getMockDataStorageClient = (props: Partial<DataStorageClient> = {}): DataStorageClient => ({
  getAllInteractions: props.getAllInteractions || jest.fn(),
  getInteractionById: props.getInteractionById || jest.fn(),
  createInteraction: props.createInteraction || jest.fn(),
  abortInteraction: props.abortInteraction || jest.fn(),
  getOngoingInteractions: props.getOngoingInteractions || jest.fn(),
  createSpatialPayload: props.createSpatialPayload || jest.fn(),
  updateInteraction: props.updateInteraction || jest.fn(),
  stop: props.stop || jest.fn(),
})

export const getMockMediaStorageClient = (props: Partial<MediaStorageClient> = {}): MediaStorageClient => ({
  saveMedia: props.saveMedia || jest.fn(),
  buildGetMediaHandler: props.buildGetMediaHandler || jest.fn(),
})

type MockFastifyProps = {
  env?: Record<string, any>
  decorate?: jest.Mock
  get?: jest.Mock
  post?: jest.Mock
  bot?: Record<string, any>
  dataStorageClient?: Record<string, any>
  mediaStorageClient?: Record<string, any>
  i18n?: Record<string, any>
  configuration?: Record<string, any>
}

export const getMockFastify = (props: MockFastifyProps = {}): FastifyInstance => ({
  decorate: props.decorate || jest.fn(),
  get: props.get || jest.fn(),
  post: props.post || jest.fn(),
  log: mockLogger,
  env: props.env || baseEnv,
  configuration: props.configuration || {},
  i18n: props.i18n || {},
  bot: props.bot || {},
  dataStorageClient: props.dataStorageClient || {},
  mediaStorageClient: props.mediaStorageClient,
} as unknown as FastifyInstance)

export type MockContextProps = {
  from?: Record<string, any>
  chat?: Record<string, any>
  update?: Record<string, any>
  telegram?: Record<string, any>
  message?: any
  currStep?: Record<string, any>
  nextStep?: Record<string, any>
  interaction?: Record<string, any>
  isInteractionCompleted?: boolean
}

export const getMockContext = (props: MockContextProps = {}): DecoratedContext => ({
  from: props.from,
  chat: props.chat,
  t: jest.fn().mockImplementation(key => `translation_${key}`),
  chatId: 'chat_id',
  update: props.update,
  reply: jest.fn(),
  telegram: props.telegram,
  message: props.message,
  answerCbQuery: jest.fn(),
  currStep: props.currStep,
  nextStep: props.nextStep,
  interaction: props.interaction,
  isInteractionCompleted: props.isInteractionCompleted,
} as unknown as DecoratedContext)

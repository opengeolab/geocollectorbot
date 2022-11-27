import { FastifyInstance, FastifyLoggerInstance } from 'fastify'

import { Interaction } from '../../models/Interaction'
import { DataStorage } from '../../schemas/config'

import { PgBaseInteractionKeys, PgClient } from './pgClient'

export interface DataStorageClient {
  getAllInteractions(shouldIncludeUserInfo?: boolean): Promise<Partial<Interaction>[]>

  getInteractionById(id: string | number): Promise<Interaction>

  createInteraction(chatId: number, username: string | undefined, firstStepId: string): Promise<void>

  abortInteraction(id: string | number): Promise<void>

  getOngoingInteractions(chatId: number): Promise<Interaction[]>

  createSpatialPayload(lat: number, lon: number): any

  updateInteraction(id: string | number, body: Partial<Interaction>): Promise<void>

  stop(): Promise<void>
}

interface DataStorageClientConstructor {
  new (config: DataStorage['configuration'], logger: FastifyLoggerInstance): DataStorageClient
}

const storageTypeToClient: Record<DataStorage['type'], DataStorageClientConstructor> = {
  postgres: PgClient,
}

const storageTypeToBaseKeys: Record<DataStorage['type'], string[]> = {
  postgres: Object.values(PgBaseInteractionKeys),
}

export const buildDataStorageClient = (service: FastifyInstance): DataStorageClient => {
  const { configuration: { dataStorage } } = service
  const { type, configuration } = dataStorage

  const Client = storageTypeToClient[type]
  return new Client(configuration, service.log)
}

export const getDataStorageBaseKeys = (type: DataStorage['type']): string[] => storageTypeToBaseKeys[type]

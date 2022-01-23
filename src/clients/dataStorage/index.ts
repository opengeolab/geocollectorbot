import { FastifyInstance, FastifyLoggerInstance } from 'fastify'

import { Interaction } from '../../models/Interaction'
import { DataStorageConfig } from '../../schemas/configuration/dataStorage'

import { PgBaseInteractionKeys, PgClient } from './pgClient'

export interface DataStorageClient {
  createInteraction(chatId: number, firstStepId: string): Promise<void>

  getOngoingInteractions(chatId: number): Promise<Interaction[]>

  createSpatialPayload(lat: number, lon: number): any

  updateInteraction(id: string | number, body: Partial<Interaction>): Promise<void>

  stop(): Promise<void>
}

interface DataStorageClientConstructor {
  new (config: DataStorageConfig['configuration'], logger: FastifyLoggerInstance): DataStorageClient
}

const storageTypeToClient: Record<DataStorageConfig['type'], DataStorageClientConstructor> = {
  postgres: PgClient,
}

const storageTypeToBaseKeys: Record<DataStorageConfig['type'], string[]> = {
  postgres: Object.values(PgBaseInteractionKeys),
}

export const buildDataStorageClient = (service: FastifyInstance): DataStorageClient => {
  const { configuration: { dataStorage } } = service
  const { type, configuration } = dataStorage

  const Client = storageTypeToClient[type]
  return new Client(configuration, service.log)
}

export const getDataStorageBaseKeys = (type: DataStorageConfig['type']): string[] => storageTypeToBaseKeys[type]

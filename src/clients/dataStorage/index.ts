import {FastifyInstance, FastifyLoggerInstance} from 'fastify'

import {Interaction} from '../../models/Interaction'
import {DataStorageConfig} from '../../schemas/configuration/dataStorage'

import {PgClient} from './pgClient'

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

export const decorateDataStorageClient = (service: FastifyInstance) => {
  const {configuration: {dataStorage}} = service
  const {type, configuration} = dataStorage

  const Client = storageTypeToClient[type]
  const client = new Client(configuration, service.log)

  service.decorate('dataStorageClient', client)
}

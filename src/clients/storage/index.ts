import {FastifyInstance, FastifyLoggerInstance} from 'fastify'

import {Interaction} from '../../models/Interaction'
import {DataStorageConfig} from '../../schemas/configuration/dataStorage'

import {PgClient} from './pgClient'

export interface StorageClient {
  getOngoingInteraction(chatId: number): Promise<Interaction>

  createInteraction(chatId: number, firstStepId: string): Promise<void>

  stop(): Promise<void>
}

interface StorageClientConstructor {
  new (config: DataStorageConfig['configuration'], logger: FastifyLoggerInstance): StorageClient
}

const storageTypeToClient: Record<DataStorageConfig['type'], StorageClientConstructor> = {
  postgres: PgClient,
}

export const decorateStorageClient = (service: Pick<FastifyInstance, 'configuration' | 'log' | 'decorate'>) => {
  const {configuration: {dataStorage: dataStorageConfig}} = service
  const {type, configuration} = dataStorageConfig

  const Client = storageTypeToClient[type]
  const client = new Client(configuration, service.log)

  service.decorate('storageClient', client)
}

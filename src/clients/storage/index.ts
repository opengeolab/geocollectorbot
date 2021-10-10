import {FastifyInstance, FastifyLoggerInstance} from 'fastify'

import {DataStorageConfig} from '../../schemas/configuration/dataStorage'
import {PgClient} from './pgClient'

export interface StorageClient {
  getOngoingInteraction(chatId: string): Record<string, any>

  stop(): Promise<void>
}

interface StorageClientConstructor {
  new (config: DataStorageConfig['configuration'], logger: FastifyLoggerInstance): StorageClient
}

const storageTypeToClient: Record<DataStorageConfig['type'], StorageClientConstructor> = {
  postgres: PgClient,
}

export const decorateStorageClient = (service: FastifyInstance): void => {
  const {configuration: {dataStorage: dataStorageConfig}, decorate} = service
  const {type, configuration} = dataStorageConfig

  const Client = storageTypeToClient[type]
  const client = new Client(configuration, service.log)

  decorate('storageClient', client)
}

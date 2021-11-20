import {FastifyInstance} from 'fastify'

import {MediaStorageConfig} from '../../schemas/configuration/mediaStorage'

import {FsClient} from './fsClient'

export interface MediaClient {
  saveMedia (): void
}

interface MediaClientConstructor {
  new (service: FastifyInstance, config: MediaStorageConfig['configuration']): MediaClient
}

const mediaTypeToClient: Record<MediaStorageConfig['type'], MediaClientConstructor> = {
  fileSystem: FsClient,
}

export const decorateStorageClient = (service: FastifyInstance) => {
  const {configuration: {mediaStorage: mediaStorageConfig}} = service
  if (!mediaStorageConfig) { return }

  const {type, configuration} = mediaStorageConfig

  const Client = mediaTypeToClient[type]
  const client = new Client(service, configuration)

  service.decorate('mediaClient', client)
}

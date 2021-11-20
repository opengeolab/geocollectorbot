import {Readable} from 'stream'

import {FastifyInstance, RouteHandlerMethod} from 'fastify'

import {MediaStorageConfig} from '../../schemas/configuration/mediaStorage'

import {FsClient} from './fsClient'

export const GET_MEDIA_BASE_PATH = '/media'

export interface MediaStorageClient {
  saveMedia (mediaStream: Readable, fileId: string): Promise<string>

  buildGetMediaHandler (): RouteHandlerMethod
}

interface MediaStorageClientConstructor {
  new (service: FastifyInstance, config: MediaStorageConfig['configuration']): MediaStorageClient
}

const mediaTypeToClient: Record<MediaStorageConfig['type'], MediaStorageClientConstructor> = {
  fileSystem: FsClient,
}

export const decorateMediaStorageClient = (service: FastifyInstance) => {
  const {configuration: {mediaStorage: mediaStorageConfig}} = service
  if (!mediaStorageConfig) { return }

  const {type, configuration} = mediaStorageConfig

  const Client = mediaTypeToClient[type]
  const client = new Client(service, configuration)

  service.get(`${GET_MEDIA_BASE_PATH}/:id`, client.buildGetMediaHandler())

  service.decorate('mediaStorageClient', client)
}

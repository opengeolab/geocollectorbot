import { Readable } from 'stream'

import { FastifyInstance, RouteHandlerMethod } from 'fastify'

import { MediaStorage } from '../../schemas/config'

import { FsClient } from './fsClient'

export interface MediaStorageClient {
  saveMedia (mediaStream: Readable, fileId: string): Promise<string>

  buildGetMediaHandler (): RouteHandlerMethod
}

interface MediaStorageClientConstructor {
  new (service: FastifyInstance, config: MediaStorage['configuration']): MediaStorageClient
}

const mediaTypeToClient: Record<MediaStorage['type'], MediaStorageClientConstructor> = {
  fileSystem: FsClient,
}

export const buildMediaStorageClient = (service: FastifyInstance): MediaStorageClient | undefined => {
  const { configuration: { mediaStorage: mediaStorageConfig } } = service
  if (!mediaStorageConfig) { return }

  const { type, configuration } = mediaStorageConfig

  const Client = mediaTypeToClient[type]
  return new Client(service, configuration)
}

export const registerGetMediaRoute = (service: FastifyInstance): void => {
  const { mediaStorageClient, env } = service
  if (!mediaStorageClient) { return }

  const handler = mediaStorageClient.buildGetMediaHandler()
  service.get(`${env.GET_MEDIA_BASE_PATH}/:id`, handler)
}

import { existsSync, mkdirSync } from 'fs'
import { writeFile } from 'fs/promises'
import { Readable } from 'stream'

import { FastifyInstance, FastifyLoggerInstance, RouteHandlerMethod } from 'fastify'
import fastifyStatic from 'fastify-static'

import { FsConfig } from '../../schemas/config'

import { GET_MEDIA_BASE_PATH, MediaStorageClient } from './index'

export class FsClient implements MediaStorageClient {
  private logger: FastifyLoggerInstance
  private readonly folderPath: string

  constructor (service: FastifyInstance, configuration: FsConfig['configuration']) {
    this.logger = service.log

    this.folderPath = configuration.folderPath

    if (!existsSync(this.folderPath)) {
      this.logger.debug({ folderPath: this.folderPath }, 'Media folder not existing. Creating it...')
      mkdirSync(this.folderPath)
    }

    service.register(fastifyStatic, { root: this.folderPath })
  }

  async saveMedia (mediaStream: Readable, fileId: string): Promise<string> {
    await writeFile(`${this.folderPath}/${fileId}`, mediaStream)
    return `${GET_MEDIA_BASE_PATH}/${fileId}`
  }

  buildGetMediaHandler (): RouteHandlerMethod {
    return function getMediaHandler (request, reply) {
      const { params: { id: mediaId } } = request as {params: {id: string}}
      reply.sendFile(mediaId)
    }
  }
}

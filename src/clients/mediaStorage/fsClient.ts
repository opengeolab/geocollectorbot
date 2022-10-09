import { existsSync, mkdirSync } from 'fs'
import { writeFile } from 'fs/promises'
import { Readable } from 'stream'

import { FastifyInstance, FastifyLoggerInstance, RouteHandlerMethod } from 'fastify'
import fastifyStatic from 'fastify-static'

import { FsConfig } from '../../schemas/config'

import { MediaStorageClient } from './index'

export class FsClient implements MediaStorageClient {
  private logger: FastifyLoggerInstance
  private readonly folderPath: string
  private readonly getMediaBasePath: string

  constructor (service: FastifyInstance, configuration: FsConfig['configuration']) {
    this.logger = service.log

    this.folderPath = configuration.folderPath
    this.getMediaBasePath = service.env.GET_MEDIA_BASE_PATH

    if (!existsSync(this.folderPath)) {
      this.logger.debug({ folderPath: this.folderPath }, 'Media folder not existing. Creating it...')
      mkdirSync(this.folderPath)
    }

    service.register(fastifyStatic, { root: this.folderPath })
  }

  async saveMedia (mediaStream: Readable, fileId: string): Promise<string> {
    await writeFile(`${this.folderPath}/${fileId}`, mediaStream)
    return `${this.getMediaBasePath}/${fileId}`
  }

  buildGetMediaHandler (): RouteHandlerMethod {
    return function getMediaHandler (request, reply) {
      const { params: { id: mediaId } } = request as {params: {id: string}}
      reply.sendFile(mediaId)
    }
  }
}

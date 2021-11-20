import fs from 'fs/promises'
import {Readable} from 'stream'

import {FastifyInstance, FastifyLoggerInstance, RouteHandlerMethod} from 'fastify'
import fastifyStatic from 'fastify-static'

import {FsConfiguration} from '../../schemas/configuration/mediaStorage/fs'

import {GET_MEDIA_BASE_PATH, MediaStorageClient} from './index'

export class FsClient implements MediaStorageClient {
  private logger: FastifyLoggerInstance
  private readonly folderPath: string

  constructor (service: FastifyInstance, configuration: FsConfiguration) {
    this.logger = service.log
    this.folderPath = configuration.folderPath

    service.register(fastifyStatic, {root: this.folderPath})
  }

  async saveMedia (mediaStream: Readable, fileId: string): Promise<string> {
    await fs.writeFile(`${this.folderPath}/${fileId}`, mediaStream)
    return `${GET_MEDIA_BASE_PATH}/${fileId}`
  }

  buildGetMediaHandler (): RouteHandlerMethod {
    return function getMediaHandler (request, reply) {
      const {params: {id: mediaId}} = request as {params: {id: string}}
      reply.sendFile(mediaId)
    }
  }
}

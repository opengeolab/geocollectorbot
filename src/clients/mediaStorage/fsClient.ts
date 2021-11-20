import {FastifyInstance} from 'fastify'

import {MediaClient} from './index'

export class FsClient implements MediaClient {
  constructor (service: FastifyInstance) { }

  saveMedia (): void { }
}

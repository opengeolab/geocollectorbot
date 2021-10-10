import {Pool} from 'pg'
import {FastifyLoggerInstance} from 'fastify'

import {StorageClient} from './index'
import {PgConfiguration} from '../../schemas/configuration/dataStorage/pg'

export class PgClient implements StorageClient {
  private pool: Pool
  private logger: FastifyLoggerInstance

  constructor(configuration: PgConfiguration, logger: FastifyLoggerInstance) {
    this.pool = new Pool(configuration)
    this.logger = logger
  }

  getOngoingInteraction(chatId: string): Record<string, any> {
    return {}
  }

  async stop() {
    this.logger.info('Shutting down Postgres pool')
    await this.pool.end()
  }
}

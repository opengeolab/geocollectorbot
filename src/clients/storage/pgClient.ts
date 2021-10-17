import {Pool} from 'pg'
import {FastifyLoggerInstance} from 'fastify'

import {StorageClient} from './index'
import {PgConfiguration} from '../../schemas/configuration/dataStorage/pg'

export class PgClient implements StorageClient {
  private pool: Pool
  private logger: FastifyLoggerInstance
  private readonly table: string

  constructor(configuration: PgConfiguration, logger: FastifyLoggerInstance) {
    this.pool = new Pool(configuration)
    this.logger = logger
    this.table = configuration.interactionsTable
  }

  getOngoingInteraction(chatId: string): Record<string, any> {
    return {}
  }

  async createInteraction(chatId: number) {
    const query = `INSERT INTO ${this.table} (chat_id) VALUES (${chatId})`

    try {
      await this.pool.query(query)
    } catch (error) {
      this.logger.error({error, chatId}, 'Cannot create new interaction')
      throw error
    }
  }

  async stop() {
    this.logger.info('Shutting down Postgres pool')
    await this.pool.end()
  }
}

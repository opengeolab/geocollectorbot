import {Pool} from 'pg'
import {FastifyLoggerInstance} from 'fastify'

import {StorageClient} from './index'
import {PgConfiguration} from '../../schemas/configuration/dataStorage/pg'
import {InteractionState} from '../../models/Interaction'

export class PgClient implements StorageClient {
  private pool: Pool
  private logger: FastifyLoggerInstance
  private readonly table: string

  constructor(configuration: PgConfiguration, logger: FastifyLoggerInstance) {
    this.pool = new Pool(configuration)
    this.logger = logger
    this.table = configuration.interactionsTable
  }

  getOngoingInteraction(): Record<string, any> {
    return {}
  }

  async createInteraction(chatId: number, firstStepId: string) {
    const query =
      `INSERT INTO ${this.table} (chat_id, currStepId, interactionState) ` +
      `VALUES (${chatId}, ${firstStepId}, ${InteractionState.ONGOING})`

    this.logger.debug({query, chatId}, 'Creating new interaction')

    await this.pool.query(query)
  }

  async stop() {
    this.logger.info('Shutting down Postgres pool')
    await this.pool.end()
  }
}

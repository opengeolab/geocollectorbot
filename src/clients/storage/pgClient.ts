import {FastifyLoggerInstance} from 'fastify'
import {Pool} from 'pg'

import {Interaction, InteractionState} from '../../models/Interaction'
import {PgConfiguration} from '../../schemas/configuration/dataStorage/pg'

import {StorageClient} from './index'

export enum PgInteractionKeys {
  id ='id',
  chatId = 'chat_id',
  currStepId = 'curr_step_id',
  interactionState = 'interaction_state',
  createdAt = 'created_at',
  updatedAt = 'updated_at'
}

type PgInteraction = {
  [PgInteractionKeys.id]: string
  [PgInteractionKeys.chatId]: string
  [PgInteractionKeys.currStepId]: string
  [PgInteractionKeys.interactionState]: InteractionState
  [PgInteractionKeys.createdAt]: string
  [PgInteractionKeys.updatedAt]: string
  [key: string]: unknown
}

export class PgClient implements StorageClient {
  private pool: Pool
  private logger: FastifyLoggerInstance
  private readonly table: string

  constructor(configuration: PgConfiguration, logger: FastifyLoggerInstance) {
    this.pool = new Pool(configuration)
    this.logger = logger
    this.table = configuration.interactionsTable
  }

  async getOngoingInteraction(chatId: number): Promise<Interaction> {
    const query = `SELECT * FROM ${this.table} WHERE ${PgInteractionKeys.chatId}=$1 AND ${PgInteractionKeys.interactionState}=$2`
    const values = [chatId, InteractionState.ONGOING]

    const {rowCount, rows} = await this.pool.query<PgInteraction>(query, values)

    if (rowCount > 1) {
      throw new Error('Too many interactions')
    }

    const [interaction] = rows

    return {
      id: interaction[PgInteractionKeys.id],
      chatId: interaction[PgInteractionKeys.chatId],
      currStepId: interaction[PgInteractionKeys.currStepId],
      interactionState: interaction[PgInteractionKeys.interactionState],
      createdAt: interaction[PgInteractionKeys.createdAt],
      updatedAt: interaction[PgInteractionKeys.updatedAt],
    }
  }

  async createInteraction(chatId: number, firstStepId: string) {
    const now = new Date().toISOString()

    const query =
      `INSERT INTO ${this.table} ` +
      `(${PgInteractionKeys.chatId}, ${PgInteractionKeys.currStepId}, ${PgInteractionKeys.interactionState}, ${PgInteractionKeys.createdAt}, ${PgInteractionKeys.updatedAt}) ` +
      `VALUES ($1, $2, $3, $4, $5)`

    const values = [chatId, firstStepId, InteractionState.ONGOING, now, now]

    this.logger.debug({query, values}, 'Creating new interaction')

    await this.pool.query(query, values)
  }

  async stop() {
    this.logger.info('Shutting down Postgres pool')
    await this.pool.end()
  }
}

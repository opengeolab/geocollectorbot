import {FastifyLoggerInstance} from 'fastify'
import {Object} from 'json-schema-to-ts/lib/meta-types'
import {Pool} from 'pg'

import {BaseInteractionKeys, Interaction, InteractionState} from '../../models/Interaction'
import {PgConfiguration} from '../../schemas/configuration/dataStorage/pg'

import {StorageClient} from './index'

export enum PgBaseInteractionKeys {
  ID = 'id',
  CHAT_ID = 'chat_id',
  CURRENT_STEP_ID = 'curr_step_id',
  INTERACTION_STATE = 'interaction_state',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export type PgInteraction = {
  [PgBaseInteractionKeys.ID]: string
  [PgBaseInteractionKeys.CHAT_ID]: number
  [PgBaseInteractionKeys.CURRENT_STEP_ID]: string
  [PgBaseInteractionKeys.INTERACTION_STATE]: InteractionState
  [PgBaseInteractionKeys.CREATED_AT]: string
  [PgBaseInteractionKeys.UPDATED_AT]: string
  [key: string]: unknown
}

export class PgClient implements StorageClient {
  private pool: Pool
  private logger: FastifyLoggerInstance
  private readonly table: string

  private readonly keysMap: Record<BaseInteractionKeys, PgBaseInteractionKeys> = {
    [BaseInteractionKeys.ID]: PgBaseInteractionKeys.ID,
    [BaseInteractionKeys.CHAT_ID]: PgBaseInteractionKeys.CHAT_ID,
    [BaseInteractionKeys.CURRENT_STEP_ID]: PgBaseInteractionKeys.CURRENT_STEP_ID,
    [BaseInteractionKeys.INTERACTION_STATE]: PgBaseInteractionKeys.INTERACTION_STATE,
    [BaseInteractionKeys.CREATED_AT]: PgBaseInteractionKeys.CREATED_AT,
    [BaseInteractionKeys.UPDATED_AT]: PgBaseInteractionKeys.UPDATED_AT,
  }

  constructor (configuration: PgConfiguration, logger: FastifyLoggerInstance) {
    this.pool = new Pool(configuration)
    this.logger = logger
    this.table = configuration.interactionsTable
  }

  async createInteraction (chatId: number, firstStepId: string) {
    const now = new Date(Date.now()).toISOString()

    const properties: PgBaseInteractionKeys[] = [
      PgBaseInteractionKeys.CHAT_ID,
      PgBaseInteractionKeys.CURRENT_STEP_ID,
      PgBaseInteractionKeys.INTERACTION_STATE,
      PgBaseInteractionKeys.CREATED_AT,
      PgBaseInteractionKeys.UPDATED_AT,
    ]

    const query = `INSERT INTO ${this.table} (${properties.join(',')}) VALUES ($1, $2, $3, $4, $5)`
    const values = [chatId, firstStepId, InteractionState.ONGOING, now, now]

    this.logger.debug({query, values}, 'Creating new interaction')
    await this.pool.query(query, values)
  }

  async getOngoingInteractions (chatId: number): Promise<Interaction[]> {
    const query = `SELECT * FROM ${this.table} WHERE ${PgBaseInteractionKeys.CHAT_ID}=$1 AND ${PgBaseInteractionKeys.INTERACTION_STATE}=$2`
    const values = [chatId, InteractionState.ONGOING]

    this.logger.debug({query, values}, 'Retrieving interactions')
    const {rows} = await this.pool.query<PgInteraction>(query, values)

    return rows.map(row => ({
      [BaseInteractionKeys.ID]: row[PgBaseInteractionKeys.ID],
      [BaseInteractionKeys.CHAT_ID]: row[PgBaseInteractionKeys.CHAT_ID],
      [BaseInteractionKeys.CURRENT_STEP_ID]: row[PgBaseInteractionKeys.CURRENT_STEP_ID],
      [BaseInteractionKeys.INTERACTION_STATE]: row[PgBaseInteractionKeys.INTERACTION_STATE],
      [BaseInteractionKeys.CREATED_AT]: row[PgBaseInteractionKeys.CREATED_AT],
      [BaseInteractionKeys.UPDATED_AT]: row[PgBaseInteractionKeys.UPDATED_AT],
    }))
  }

  async updateInteraction (id: string | number, body: Partial<Interaction>) {
    const now = new Date(Date.now()).toISOString()

    const patchBody = {...body, [BaseInteractionKeys.UPDATED_AT]: now}

    const patchColumns = Object
      .keys(patchBody)
      .map((key, idx) => `${this.keysMap[key as BaseInteractionKeys] || key}=$${idx + 1}`)
      .join(',')

    const patchValues = Object.values(patchBody)

    const query = `UPDATE ${this.table} SET ${patchColumns} WHERE ${PgBaseInteractionKeys.ID}=$${patchValues.length + 1}`
    const values = [...patchValues, id]

    this.logger.debug({query, values}, 'Updating interaction')
    const {rowCount} = await this.pool.query(query, values)

    if (rowCount !== 1) { throw new Error(`Error updating interaction. ${rowCount} rows updated`) }
  }

  async stop () {
    this.logger.info('Shutting down Postgres pool')
    await this.pool.end()
  }
}

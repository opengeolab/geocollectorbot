import { FastifyLoggerInstance } from 'fastify'
import { Pool } from 'pg'

import { BaseInteractionKeys, Interaction, InteractionState } from '../../models/Interaction'
import { PgConfig } from '../../schemas/config'

import { DataStorageClient } from './index'

export enum PgBaseInteractionKeys {
  ID = 'id',
  CHAT_ID = 'chat_id',
  USERNAME = 'username',
  CURRENT_STEP_ID = 'curr_step_id',
  INTERACTION_STATE = 'interaction_state',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export type PgInteraction = {
  [PgBaseInteractionKeys.ID]: string
  [PgBaseInteractionKeys.CHAT_ID]: number
  [PgBaseInteractionKeys.USERNAME]?: string
  [PgBaseInteractionKeys.CURRENT_STEP_ID]: string
  [PgBaseInteractionKeys.INTERACTION_STATE]: InteractionState
  [PgBaseInteractionKeys.CREATED_AT]: string
  [PgBaseInteractionKeys.UPDATED_AT]: string
  [key: string]: unknown
}

export class PgClient implements DataStorageClient {
  private pool: Pool
  private logger: FastifyLoggerInstance
  private readonly table: string

  private readonly keysMap: Record<BaseInteractionKeys, PgBaseInteractionKeys> = {
    [BaseInteractionKeys.ID]: PgBaseInteractionKeys.ID,
    [BaseInteractionKeys.CHAT_ID]: PgBaseInteractionKeys.CHAT_ID,
    [BaseInteractionKeys.USERNAME]: PgBaseInteractionKeys.USERNAME,
    [BaseInteractionKeys.CURRENT_STEP_ID]: PgBaseInteractionKeys.CURRENT_STEP_ID,
    [BaseInteractionKeys.INTERACTION_STATE]: PgBaseInteractionKeys.INTERACTION_STATE,
    [BaseInteractionKeys.CREATED_AT]: PgBaseInteractionKeys.CREATED_AT,
    [BaseInteractionKeys.UPDATED_AT]: PgBaseInteractionKeys.UPDATED_AT,
  }

  constructor (configuration: PgConfig['configuration'], logger: FastifyLoggerInstance) {
    const { connectionString, interactionsTable, ssl } = configuration

    this.logger = logger

    this.pool = new Pool({
      connectionString,
      ssl: ssl ? { rejectUnauthorized: false } : false,
    })

    this.table = interactionsTable
  }

  async getAllInteractions (shouldIncludeUserInfo?: boolean): Promise<Partial<Interaction>[]> {
    const query = `SELECT * FROM ${this.table}`

    this.logger.debug({ query }, 'Retrieving interactions')
    const { rows } = await this.pool.query<PgInteraction>(query)

    return rows.map(row => {
      const {
        [PgBaseInteractionKeys.ID]: id,
        [PgBaseInteractionKeys.CHAT_ID]: chatId,
        [PgBaseInteractionKeys.USERNAME]: username,
        [PgBaseInteractionKeys.CURRENT_STEP_ID]: currentStepId,
        [PgBaseInteractionKeys.INTERACTION_STATE]: interactionState,
        [PgBaseInteractionKeys.CREATED_AT]: createdAt,
        [PgBaseInteractionKeys.UPDATED_AT]: updatedAt,
        ...rest
      } = row

      const redactedInteraction: Partial<Interaction> = {
        [BaseInteractionKeys.ID]: id,
        [BaseInteractionKeys.CURRENT_STEP_ID]: currentStepId,
        [BaseInteractionKeys.INTERACTION_STATE]: interactionState,
        [BaseInteractionKeys.CREATED_AT]: createdAt,
        [BaseInteractionKeys.UPDATED_AT]: updatedAt,
        ...rest,
      }

      if (shouldIncludeUserInfo) {
        redactedInteraction[BaseInteractionKeys.CHAT_ID] = chatId
        redactedInteraction[BaseInteractionKeys.USERNAME] = username
      }

      return redactedInteraction
    })
  }

  async createInteraction (chatId: number, username: string | undefined, firstStepId: string) {
    const now = new Date(Date.now()).toISOString()

    const properties: PgBaseInteractionKeys[] = [
      PgBaseInteractionKeys.CHAT_ID,
      PgBaseInteractionKeys.USERNAME,
      PgBaseInteractionKeys.CURRENT_STEP_ID,
      PgBaseInteractionKeys.INTERACTION_STATE,
      PgBaseInteractionKeys.CREATED_AT,
      PgBaseInteractionKeys.UPDATED_AT,
    ]

    const query = `INSERT INTO ${this.table} (${properties.join(',')}) VALUES ($1, $2, $3, $4, $5, $6)`
    const values = [chatId, username, firstStepId, InteractionState.ONGOING, now, now]

    this.logger.debug({ query, values }, 'Creating new interaction')
    await this.pool.query(query, values)
  }

  async abortInteraction (id: string | number) {
    const body: Partial<Interaction> = { interactionState: InteractionState.ABORTED }

    this.logger.debug({ id }, 'Aborting interaction')
    await this.updateInteraction(id, body)
  }

  async getOngoingInteractions (chatId: number): Promise<Interaction[]> {
    const query = `SELECT * FROM ${this.table} WHERE ${PgBaseInteractionKeys.CHAT_ID}=$1 AND ${PgBaseInteractionKeys.INTERACTION_STATE}=$2`
    const values = [chatId, InteractionState.ONGOING]

    this.logger.debug({ query, values }, 'Retrieving interactions')
    const { rows } = await this.pool.query<PgInteraction>(query, values)

    return rows.map(row => ({
      [BaseInteractionKeys.ID]: row[PgBaseInteractionKeys.ID],
      [BaseInteractionKeys.CHAT_ID]: row[PgBaseInteractionKeys.CHAT_ID],
      [BaseInteractionKeys.USERNAME]: row[PgBaseInteractionKeys.USERNAME],
      [BaseInteractionKeys.CURRENT_STEP_ID]: row[PgBaseInteractionKeys.CURRENT_STEP_ID],
      [BaseInteractionKeys.INTERACTION_STATE]: row[PgBaseInteractionKeys.INTERACTION_STATE],
      [BaseInteractionKeys.CREATED_AT]: row[PgBaseInteractionKeys.CREATED_AT],
      [BaseInteractionKeys.UPDATED_AT]: row[PgBaseInteractionKeys.UPDATED_AT],
    }))
  }

  createSpatialPayload (lat: number, lon: number): any {
    return `SRID=4326;POINT(${lon} ${lat})`
  }

  async updateInteraction (id: string | number, body: Partial<Interaction>) {
    const now = new Date(Date.now()).toISOString()

    const patchBody = { ...body, [BaseInteractionKeys.UPDATED_AT]: now }

    const patchColumns = Object
      .keys(patchBody)
      .map((key, idx) => `${this.keysMap[key as BaseInteractionKeys] || key}=$${idx + 1}`)
      .join(',')

    const patchValues = Object.values(patchBody)

    const query = `UPDATE ${this.table} SET ${patchColumns} WHERE ${PgBaseInteractionKeys.ID}=$${patchValues.length + 1}`
    const values = [...patchValues, id]

    this.logger.debug({ query, values }, 'Updating interaction')
    const { rowCount } = await this.pool.query(query, values)

    if (rowCount !== 1) { throw new Error(`Error updating interaction. ${rowCount} rows updated`) }
  }

  async stop () {
    this.logger.info('Shutting down Postgres pool')
    await this.pool.end()
  }
}

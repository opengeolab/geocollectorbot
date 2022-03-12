import { Pool } from 'pg'

import { BaseInteractionKeys, Interaction, InteractionState } from '../../../models/Interaction'
import { PgConfiguration } from '../../../schemas/configuration/dataStorage/pg'
import { mockLogger } from '../../../utils/testUtils'
import { DataStorageClient } from '../index'
import { PgClient, PgInteraction } from '../pgClient'

jest.mock('pg', () => ({
  ...jest.requireActual('pg'),
  Pool: jest.fn(),
}))

describe('Postgres client', () => {
  const now = Date.now()
  const nowIsoString = new Date(now).toISOString()
  jest.spyOn(Date, 'now').mockReturnValue(now)

  const mockPoolQuery = jest.fn()
  const mockPoolEnd = jest.fn()

  const mockPool = {
    query: mockPoolQuery,
    end: mockPoolEnd,
  };

  (Pool as unknown as jest.Mock).mockReturnValue(mockPool)

  const config: PgConfiguration = {
    connectionString: 'postgresql://user:password@host:5432/database',
    interactionsTable: 'interactions_table',
    ssl: false,
  }

  const chatId = 123
  const username = 'user_name'

  let pgClient: DataStorageClient

  beforeEach(() => { pgClient = new PgClient(config, mockLogger) })

  afterAll(() => jest.restoreAllMocks())

  describe('constructor', () => {
    it('should build without ssl', () => {
      const customConfig: PgConfiguration = {
        connectionString: 'postgresql://user:password@host:5432/database',
        interactionsTable: 'interactions_table',
        ssl: false,
      }

      // eslint-disable-next-line no-new
      new PgClient(customConfig, mockLogger)

      expect(Pool).toHaveBeenCalledTimes(2)
      expect(Pool).toHaveBeenLastCalledWith({
        connectionString: customConfig.connectionString,
        ssl: false,
      })
    })

    it('should build with ssl', () => {
      const customConfig: PgConfiguration = {
        connectionString: 'postgresql://user:password@host:5432/database',
        interactionsTable: 'interactions_table',
        ssl: true,
      }

      // eslint-disable-next-line no-new
      new PgClient(customConfig, mockLogger)

      expect(Pool).toHaveBeenCalledTimes(2)
      expect(Pool).toHaveBeenLastCalledWith({
        connectionString: customConfig.connectionString,
        ssl: { rejectUnauthorized: false },
      })
    })
  })

  describe('createInteraction', () => {
    const firstStepId = 'first_step'
    const expectedQuery = 'INSERT INTO interactions_table (chat_id,username,curr_step_id,interaction_state,created_at,updated_at) VALUES ($1, $2, $3, $4, $5, $6)'
    const expectedValue = [chatId, username, firstStepId, InteractionState.ONGOING, nowIsoString, nowIsoString]

    it('should throw if query fails', async () => {
      const expectedError = new Error('Query error')
      mockPoolQuery.mockRejectedValue(expectedError)

      const executor = pgClient.createInteraction(chatId, username, firstStepId)
      await expect(executor)
        .rejects
        .toStrictEqual(expectedError)

      expect(mockPoolQuery).toHaveBeenCalledTimes(1)
      expect(mockPoolQuery).toHaveBeenCalledWith(expectedQuery, expectedValue)
    })

    it('should correctly query the db', async () => {
      mockPoolQuery.mockResolvedValue('query_result')

      await pgClient.createInteraction(chatId, username, firstStepId)

      expect(mockPoolQuery).toHaveBeenCalledTimes(1)
      expect(mockPoolQuery).toHaveBeenCalledWith(expectedQuery, expectedValue)
    })
  })

  describe('abortInteraction', () => {
    const id = 'interaction_id'

    const expectedQuery = 'UPDATE interactions_table ' +
      'SET interaction_state=$1,updated_at=$2 ' +
      'WHERE id=$3'

    const expectedValue = [InteractionState.ABORTED, nowIsoString, id]

    it('should throw if query fails', async () => {
      const expectedError = new Error('Query error')
      mockPoolQuery.mockRejectedValue(expectedError)

      const executor = pgClient.abortInteraction(id)
      await expect(executor)
        .rejects
        .toStrictEqual(expectedError)

      expect(mockPoolQuery).toHaveBeenCalledTimes(1)
      expect(mockPoolQuery).toHaveBeenCalledWith(expectedQuery, expectedValue)
    })

    it('should correctly query the db', async () => {
      mockPoolQuery.mockResolvedValue({ rowCount: 1 })

      await pgClient.abortInteraction(id)

      expect(mockPoolQuery).toHaveBeenCalledTimes(1)
      expect(mockPoolQuery).toHaveBeenCalledWith(expectedQuery, expectedValue)
    })
  })

  describe('getOngoingInteractions', () => {
    const expectedQuery = 'SELECT * FROM interactions_table WHERE chat_id=$1 AND interaction_state=$2'
    const expectedValue = [123, InteractionState.ONGOING]

    it('should throw if query fails', async () => {
      const expectedError = new Error('Query error')
      mockPoolQuery.mockRejectedValue(expectedError)

      const executor = pgClient.getOngoingInteractions(chatId)
      await expect(executor)
        .rejects
        .toStrictEqual(expectedError)

      expect(mockPoolQuery).toHaveBeenCalledTimes(1)
      expect(mockPoolQuery).toHaveBeenCalledWith(expectedQuery, expectedValue)
    })

    it('should correctly query the db', async () => {
      const pgRows: PgInteraction[] = [
        {
          id: 'id_1',
          chat_id: chatId,
          curr_step_id: 'current_step_id',
          interaction_state: InteractionState.ONGOING,
          created_at: 'created_at',
          updated_at: 'updated_at',
        },
        {
          id: 'id_2',
          chat_id: chatId,
          username,
          curr_step_id: 'current_step_id',
          interaction_state: InteractionState.ONGOING,
          created_at: 'created_at',
          updated_at: 'updated_at',
        },
      ]

      mockPoolQuery.mockResolvedValue({ rows: pgRows })

      const rows = await pgClient.getOngoingInteractions(chatId)

      expect(rows).toStrictEqual([
        {
          id: 'id_1',
          chatId: 123,
          username: undefined,
          currStepId: 'current_step_id',
          interactionState: InteractionState.ONGOING,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
        {
          id: 'id_2',
          chatId: 123,
          username,
          currStepId: 'current_step_id',
          interactionState: InteractionState.ONGOING,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
      ])

      expect(mockPoolQuery).toHaveBeenCalledTimes(1)
      expect(mockPoolQuery).toHaveBeenCalledWith(expectedQuery, expectedValue)
    })
  })

  describe('createSpatialPayload', () => {
    it('should return correct payload', () => {
      const result = pgClient.createSpatialPayload(10, 10)
      expect(result).toEqual('SRID=4326;POINT(10 10)')
    })
  })

  describe('updateInteraction', () => {
    const id = 'interaction_id'

    const body: Partial<Interaction> = {
      [BaseInteractionKeys.ID]: 1234,
      [BaseInteractionKeys.CHAT_ID]: chatId,
      [BaseInteractionKeys.CURRENT_STEP_ID]: 'curr_step_id',
      [BaseInteractionKeys.INTERACTION_STATE]: InteractionState.ONGOING,
      [BaseInteractionKeys.CREATED_AT]: 'created_at',
      [BaseInteractionKeys.UPDATED_AT]: 'updated_at',
      unknownKey: 'foo',
    }

    const expectedQuery = 'UPDATE interactions_table ' +
      'SET id=$1,chat_id=$2,curr_step_id=$3,interaction_state=$4,created_at=$5,updated_at=$6,unknownKey=$7 ' +
      'WHERE id=$8'

    const expectedValue = [1234, chatId, 'curr_step_id', InteractionState.ONGOING, 'created_at', nowIsoString, 'foo', id]

    it('should throw if query fails', async () => {
      const expectedError = new Error('Query error')
      mockPoolQuery.mockRejectedValue(expectedError)

      const executor = pgClient.updateInteraction(id, body)
      await expect(executor)
        .rejects
        .toStrictEqual(expectedError)

      expect(mockPoolQuery).toHaveBeenCalledTimes(1)
      expect(mockPoolQuery).toHaveBeenCalledWith(expectedQuery, expectedValue)
    })

    it('should throw if updated rows count is not 1', async () => {
      const expectedError = new Error('Error updating interaction. 0 rows updated')
      mockPoolQuery.mockResolvedValue({ rowCount: 0 })

      const executor = pgClient.updateInteraction(id, body)
      await expect(executor)
        .rejects
        .toStrictEqual(expectedError)

      expect(mockPoolQuery).toHaveBeenCalledTimes(1)
      expect(mockPoolQuery).toHaveBeenCalledWith(expectedQuery, expectedValue)
    })

    it('should correctly query the db', async () => {
      mockPoolQuery.mockResolvedValue({ rowCount: 1 })

      await pgClient.updateInteraction(id, body)

      expect(mockPoolQuery).toHaveBeenCalledTimes(1)
      expect(mockPoolQuery).toHaveBeenCalledWith(expectedQuery, expectedValue)
    })
  })

  describe('stop', () => {
    it('should end the pool', async () => {
      await pgClient.stop()
      expect(mockPoolEnd).toHaveBeenCalledTimes(1)
    })
  })
})

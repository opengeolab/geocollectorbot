import {Pool} from 'pg'

import {PgClient} from '../pgClient'
import {StorageClient} from '../index'
import {mockLogger} from '../../../utils/testUtils'
import {PgConfiguration} from '../../../schemas/configuration/dataStorage/pg'

jest.mock('pg', () => ({
  ...jest.requireActual('pg'),
  Pool: jest.fn(),
}))

describe('Postgres client', () => {
  const mockPoolQuery = jest.fn()
  const mockPoolEnd = jest.fn()

  const mockPool = {
    query: mockPoolQuery,
    end: mockPoolEnd,
  };

  (Pool as unknown as jest.Mock).mockReturnValue(mockPool)

  const config: PgConfiguration = {
    user: 'user',
    password: 'password',
    host: 'host',
    database: 'database',
    port: 80,
    interactionsTable: 'interactions_table',
  }

  const chatId = 123

  let pgClient: StorageClient

  beforeEach(() => { pgClient = new PgClient(config, mockLogger) })

  afterEach(() => jest.clearAllMocks())

  describe('createInteraction', () => {
    const firstStepId = 'first_step'
    const expectedQuery = 'INSERT INTO interactions_table (chat_id, currStepId, interactionState) VALUES (123, first_step, ongoing)'

    it('should throw if query fails', async() => {
      const expectedError = new Error('Query error')
      mockPoolQuery.mockRejectedValue(expectedError)

      try {
        await pgClient.createInteraction(chatId, firstStepId)
        expect(true).toBeFalsy()
      } catch (error) {
        expect(error).toEqual(expectedError)
      }

      expect(mockPoolQuery).toHaveBeenCalledTimes(1)
      expect(mockPoolQuery).toHaveBeenCalledWith(expectedQuery)
    })

    it('should correctly query the db', async() => {
      mockPoolQuery.mockResolvedValue('query_result')

      try {
        await pgClient.createInteraction(chatId, firstStepId)
      } catch (error) {
        expect(true).toBeFalsy()
      }

      expect(mockPoolQuery).toHaveBeenCalledTimes(1)
      expect(mockPoolQuery).toHaveBeenCalledWith(expectedQuery)

      expect(mockLogger.error).toHaveBeenCalledTimes(0)
    })
  })

  describe('stop', () => {
    it('should end the pool', async() => {
      await pgClient.stop()
      expect(mockPoolEnd).toHaveBeenCalledTimes(1)
    })
  })
})

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
    it('should throw if query fails', async() => {
      const expectedError = new Error('Query error')
      mockPoolQuery.mockRejectedValue(expectedError)

      try {
        await pgClient.createInteraction(chatId)
        expect(true).toBeFalsy()
      } catch (error) {
        expect(error).toEqual(expectedError)
      }

      const expectedQuery = `INSERT INTO ${config.interactionsTable} (chat_id) VALUES (${chatId})`
      expect(mockPoolQuery).toHaveBeenCalledTimes(1)
      expect(mockPoolQuery).toHaveBeenCalledWith(expectedQuery)

      expect(mockLogger.error).toHaveBeenCalledTimes(1)
    })

    it('should correctly query the db', async() => {
      mockPoolQuery.mockResolvedValue('query_result')

      try {
        await pgClient.createInteraction(chatId)
      } catch (error) {
        expect(true).toBeFalsy()
      }

      const expectedQuery = `INSERT INTO ${config.interactionsTable} (chat_id) VALUES (${chatId})`
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

import { Configuration } from '../../../models/Configuration'
import { DataStorage } from '../../../schemas/config'
import { getMockFastify, mockLogger } from '../../../utils/testUtils'
import { buildDataStorageClient, getDataStorageBaseKeys } from '../index'
import { PgBaseInteractionKeys, PgClient } from '../pgClient'

jest.mock('../pgClient', () => ({
  ...jest.requireActual('../pgClient'),
  PgClient: jest.fn(),
}))

describe('Data storage client', () => {
  const buildMockService = (dataStorageConfig: DataStorage) => {
    const configuration: Configuration = {
      flow: { firstStepId: 'foo', steps: {} },
      dataStorage: dataStorageConfig,
    }

    return getMockFastify({ configuration })
  }

  describe('buildDataStorageClient', () => {
    it('should correctly build Postgres client', () => {
      const config: DataStorage = {
        type: 'postgres',
        configuration: {
          connectionString: 'postgresql://user:password@host:5432/database',
          interactionsTable: 'interactions_table',
          ssl: false,
        },
      }

      const mockService = buildMockService(config)

      const result = buildDataStorageClient(mockService)

      expect(result).toBeInstanceOf(PgClient)

      expect(PgClient).toHaveBeenCalledTimes(1)
      expect(PgClient).toHaveBeenCalledWith(config.configuration, mockLogger)
    })
  })

  describe('getDataStorageBaseKeys', () => {
    it('should correctly return base keys', () => {
      const pgKeys = getDataStorageBaseKeys('postgres')
      expect(pgKeys).toEqual(Object.values(PgBaseInteractionKeys))
    })
  })
})

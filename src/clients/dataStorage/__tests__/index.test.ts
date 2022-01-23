import { Configuration } from '../../../models/Configuration'
import { DataStorageConfig } from '../../../schemas/configuration/dataStorage'
import { getMockFastify, mockLogger } from '../../../utils/testUtils'
import { buildDataStorageClient, getDataStorageBaseKeys } from '../index'
import { PgBaseInteractionKeys, PgClient } from '../pgClient'

jest.mock('../pgClient', () => ({
  ...jest.requireActual('../pgClient'),
  PgClient: jest.fn(),
}))

describe('Data storage client', () => {
  const buildMockService = (dataStorageConfig: DataStorageConfig) => {
    const configuration: Configuration = {
      flow: { firstStepId: 'foo', steps: {} },
      dataStorage: dataStorageConfig,
    }

    return getMockFastify({ configuration })
  }

  describe('buildDataStorageClient', () => {
    it('should correctly build Postgres client', () => {
      const config: DataStorageConfig = {
        type: 'postgres',
        configuration: {
          user: 'user',
          password: 'password',
          host: 'host',
          database: 'database',
          port: 80,
          interactionsTable: 'interactions_table',
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

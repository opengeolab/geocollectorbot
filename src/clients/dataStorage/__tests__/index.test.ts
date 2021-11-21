import {Configuration} from '../../../models/Configuration'
import {DataStorageConfig} from '../../../schemas/configuration/dataStorage'
import {getMockFastify, mockLogger} from '../../../utils/testUtils'
import {decorateDataStorageClient} from '../index'
import {PgClient} from '../pgClient'

jest.mock('../pgClient', () => ({
  ...jest.requireActual('../pgClient'),
  PgClient: jest.fn(),
}))

describe('Data storage client', () => {
  const mockDecorate = jest.fn()

  const buildMockService = (dataStorageConfig: DataStorageConfig) => {
    const configuration: Configuration = {
      flow: {firstStepId: 'foo', steps: {}},
      dataStorage: dataStorageConfig,
    }

    return getMockFastify({configuration, decorate: mockDecorate})
  }

  afterEach(() => jest.clearAllMocks())

  it('should correctly decorate with Postgres client', () => {
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

    decorateDataStorageClient(mockService)

    expect(PgClient).toHaveBeenCalledTimes(1)
    expect(PgClient).toHaveBeenCalledWith(config.configuration, mockLogger)

    expect(mockDecorate).toHaveBeenCalledTimes(1)
    expect(mockDecorate).toHaveBeenCalledWith('dataStorageClient', {})
  })
})
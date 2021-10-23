import {decorateStorageClient} from '../index'
import {PgClient} from '../pgClient'
import {mockLogger} from '../../../utils/testUtils'
import {Configuration} from '../../../models/Configuration'
import {DataStorageConfig} from '../../../schemas/configuration/dataStorage'

jest.mock('../pgClient', () => ({
  ...jest.requireActual('../pgClient'),
  PgClient: jest.fn(),
}))

describe('Storage client', () => {
  const mockDecorate = jest.fn()

  const buildMockService = (dataStorageConfig: DataStorageConfig) => {
    const config: Configuration = {
      flow: {firstStepId: 'foo', steps: {}},
      dataStorage: dataStorageConfig,
    }

    return {configuration: config, log: mockLogger, decorate: mockDecorate}
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

    decorateStorageClient(mockService)

    expect(PgClient).toHaveBeenCalledTimes(1)
    expect(PgClient).toHaveBeenCalledWith(config.configuration, mockLogger)

    expect(mockDecorate).toHaveBeenCalledTimes(1)
    expect(mockDecorate).toHaveBeenCalledWith('storageClient', {})
  })
})

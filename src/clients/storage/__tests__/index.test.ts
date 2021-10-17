import {decorateStorageClient} from '../index'
import {PgClient} from '../pgClient'
import baeConfig from '../../../__mocks__/configmap.json'
import {Configuration} from '../../../schemas/configuration'
import {mockLogger} from '../../../utils/testUtils'

jest.mock('../pgClient', () => ({
  ...jest.requireActual('../pgClient'),
  PgClient: jest.fn(),
}))

describe('Storage client', () => {
  const mockDecorate = jest.fn()

  const buildMockService = (config: Configuration) => ({
    configuration: config,
    log: mockLogger,
    decorate: mockDecorate,
  })

  afterEach(() => jest.clearAllMocks())

  it('should correctly decorate with Postgres client', () => {
    const config: Configuration = {
      ...baeConfig,
      dataStorage: {
        type: 'postgres',
        configuration: {
          user: 'user',
          password: 'password',
          host: 'host',
          database: 'database',
          port: 80,
          interactionsTable: 'interactions_table',
        },
      },
    }

    const mockService = buildMockService(config)

    decorateStorageClient(mockService)

    expect(PgClient).toHaveBeenCalledTimes(1)
    expect(PgClient).toHaveBeenCalledWith(config.dataStorage.configuration, mockLogger)

    expect(mockDecorate).toHaveBeenCalledTimes(1)
    expect(mockDecorate).toHaveBeenCalledWith('storageClient', {})
  })
})

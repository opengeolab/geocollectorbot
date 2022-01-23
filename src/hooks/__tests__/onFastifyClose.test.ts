import { FastifyInstance } from 'fastify'

import { getMockFastify, getMockDataStorageClient, mockLogger } from '../../utils/testUtils'
import { onFastifyCloseHandler } from '../onFastifyClose'

describe('onFastifyClose', () => {
  const mockDone = jest.fn()

  const mockBot = { stop: jest.fn() }
  const mockDataStorageClient = getMockDataStorageClient()

  const mockFastify = getMockFastify({ bot: mockBot, dataStorageClient: mockDataStorageClient })

  afterEach(() => jest.resetAllMocks())

  it('should close correctly', () => {
    onFastifyCloseHandler(mockFastify, mockDone)

    expect(mockBot.stop).toHaveBeenCalledTimes(1)
    expect(mockDataStorageClient.stop).toHaveBeenCalledTimes(1)
    expect(mockDone).toHaveBeenCalledTimes(1)
  })

  it('should close correctly without bot and data storage client', () => {
    const customMockFastify: FastifyInstance = { log: mockLogger } as unknown as FastifyInstance

    onFastifyCloseHandler(customMockFastify, mockDone)

    expect(mockBot.stop).toHaveBeenCalledTimes(0)
    expect(mockDataStorageClient.stop).toHaveBeenCalledTimes(0)
    expect(mockDone).toHaveBeenCalledTimes(1)
  })
})

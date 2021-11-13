import {FastifyInstance} from 'fastify'

import {getMockFastify, getMockStorageClient, mockLogger} from '../../utils/testUtils'
import {onFastifyCloseHandler} from '../onFastifyClose'

describe('onFastifyClose', () => {
  const mockDone = jest.fn()

  const mockBot = {stop: jest.fn()}
  const mockStorageClient = getMockStorageClient()

  const mockFastify = getMockFastify({bot: mockBot, storageClient: mockStorageClient})

  afterEach(() => jest.resetAllMocks())

  it('should close correctly', () => {
    onFastifyCloseHandler(mockFastify, mockDone)

    expect(mockBot.stop).toHaveBeenCalledTimes(1)
    expect(mockStorageClient.stop).toHaveBeenCalledTimes(1)
    expect(mockDone).toHaveBeenCalledTimes(1)
  })

  it('should close correctly without bot and storage client', () => {
    const customMockFastify: FastifyInstance = {log: mockLogger} as unknown as FastifyInstance

    onFastifyCloseHandler(customMockFastify, mockDone)

    expect(mockBot.stop).toHaveBeenCalledTimes(0)
    expect(mockStorageClient.stop).toHaveBeenCalledTimes(0)
    expect(mockDone).toHaveBeenCalledTimes(1)
  })
})

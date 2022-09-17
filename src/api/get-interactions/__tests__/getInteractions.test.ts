import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import { RawConfigurationSettings } from '../../../schemas/configuration'
import { getMockDataStorageClient, mockLogger } from '../../../utils/testUtils'
import getInteractions from '../handler'

describe('GET - /interactions', () => {
  const mockGetAllInteractions = jest.fn()
  const mockStorageClient = getMockDataStorageClient({ getAllInteractions: mockGetAllInteractions })

  const getMockFastify = (settings?: RawConfigurationSettings): FastifyInstance => ({
    dataStorageClient: mockStorageClient,
    log: mockLogger,
    configuration: { settings },
  } as unknown as FastifyInstance)

  const mockRequest = {} as unknown as FastifyRequest

  const mockSend = jest.fn()
  const mockStatus = jest.fn().mockReturnValue({ send: mockSend })
  const mockReply = { status: mockStatus } as unknown as FastifyReply

  it('should return an error if get interactions fails', async () => {
    mockGetAllInteractions.mockRejectedValue(new Error('database_error'))

    const fastify = getMockFastify()

    const handler = getInteractions.bind(fastify)

    // @ts-ignore
    await handler(mockRequest, mockReply)

    expect(mockStatus).toHaveBeenCalledTimes(1)
    expect(mockStatus).toHaveBeenCalledWith(500)

    expect(mockSend).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenCalledWith({ status: 500, error: 'Internal Server Error', message: 'database_error' })

    expect(mockGetAllInteractions).toHaveBeenCalledTimes(1)
    expect(mockGetAllInteractions).toHaveBeenCalledWith(undefined)
  })

  it('should return interactions successfully', async () => {
    mockGetAllInteractions.mockResolvedValue([{ foo: 'bar' }])

    const fastify = getMockFastify({ includeUserInfoInGetInteractionsApi: true })

    const handler = getInteractions.bind(fastify)

    // @ts-ignore
    await handler(mockRequest, mockReply)

    expect(mockStatus).toHaveBeenCalledTimes(1)
    expect(mockStatus).toHaveBeenCalledWith(200)

    expect(mockSend).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenCalledWith([{ foo: 'bar' }])

    expect(mockGetAllInteractions).toHaveBeenCalledTimes(1)
    expect(mockGetAllInteractions).toHaveBeenCalledWith(true)
  })
})

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import { mockLogger } from '../../../utils/testUtils'
import sendMessageHandler from '../handler'

describe('POST - /send-message', () => {
  const mockSendMessage = jest.fn()
  const mockBot = { telegram: { sendMessage: mockSendMessage } }

  const mockFastify = { bot: mockBot, log: mockLogger } as unknown as FastifyInstance

  const mockRequest = { body: { chatIds: ['chat_1', 'chat_2'], message: 'test_message' } } as unknown as FastifyRequest

  const mockSend = jest.fn()
  const mockStatus = jest.fn().mockReturnValue({ send: mockSend })
  const mockReply = { status: mockStatus } as unknown as FastifyReply

  const handler = sendMessageHandler.bind(mockFastify)

  it('should send message to all chats successfully', async () => {
    mockSendMessage.mockResolvedValue({})

    // @ts-ignore
    await handler(mockRequest, mockReply)

    expect(mockStatus).toHaveBeenCalledTimes(1)
    expect(mockStatus).toHaveBeenCalledWith(200)

    expect(mockSend).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenCalledWith({ errors: [] })

    expect(mockSendMessage).toHaveBeenCalledTimes(2)
    expect(mockSendMessage).toHaveBeenNthCalledWith(1, 'chat_1', 'test_message')
    expect(mockSendMessage).toHaveBeenNthCalledWith(2, 'chat_2', 'test_message')
  })

  it('should send message to all chat with errors', async () => {
    mockSendMessage.mockResolvedValueOnce({})
    mockSendMessage.mockRejectedValueOnce({ on: { payload: { chat_id: 'chat_2' } }, message: 'error' })

    // @ts-ignore
    await handler(mockRequest, mockReply)

    expect(mockStatus).toHaveBeenCalledTimes(1)
    expect(mockStatus).toHaveBeenCalledWith(200)

    expect(mockSend).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenCalledWith({ errors: [{ chatId: 'chat_2', message: 'error' }] })

    expect(mockSendMessage).toHaveBeenCalledTimes(2)
    expect(mockSendMessage).toHaveBeenNthCalledWith(1, 'chat_1', 'test_message')
    expect(mockSendMessage).toHaveBeenNthCalledWith(2, 'chat_2', 'test_message')
  })
})

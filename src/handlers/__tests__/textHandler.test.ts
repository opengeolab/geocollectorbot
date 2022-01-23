import { MiddlewareFn } from 'telegraf'
import { Message } from 'telegraf/typings/core/types/typegram'

import * as messageHandler from '../../lib/messageHandler'
import { StepProps } from '../../lib/messageHandler'
import { DecoratedContext } from '../../models/DecoratedContext'
import { StepType } from '../../models/Flow'
import { ProcessError } from '../../utils/Errors'
import { getMockContext, getMockFastify } from '../../utils/testUtils'
import { buildTextHandler } from '../textHandler'

describe('Text handler', () => {
  const mockHandleIncomingMessage = jest.spyOn(messageHandler, 'handleIncomingMessage')

  const mockService = getMockFastify()
  const mockContext = getMockContext()

  let handler: MiddlewareFn<DecoratedContext>

  beforeEach(() => { handler = buildTextHandler(mockService) as MiddlewareFn<DecoratedContext> })

  it('should build correctly', async () => {
    mockHandleIncomingMessage.mockResolvedValue()

    await handler(mockContext, jest.fn())

    expect(mockHandleIncomingMessage).toHaveBeenCalledTimes(1)
    expect(mockHandleIncomingMessage).toHaveBeenCalledWith(mockService, mockContext, expect.any(Function), expect.any(Function))
  })

  describe('stepValidator', () => {
    it('should throw if wrong step type', async () => {
      mockHandleIncomingMessage.mockResolvedValue()

      await handler(mockContext, jest.fn())

      const props = {
        service: mockService,
        ctx: mockContext,
        currStep: { config: { type: 'wrong_type' } },
      } as unknown as StepProps<Message.TextMessage>

      const [[,, valueBuilder]] = mockHandleIncomingMessage.mock.calls

      expect(() => valueBuilder(props))
        .toThrow(new ProcessError('Wrong current step type', 'translation_errors.wrongStepType'))

      expect(mockContext.t).toHaveBeenCalledTimes(1)
      expect(mockContext.t).toHaveBeenCalledWith('errors.wrongStepType')
    })

    it('should return if right step type', async () => {
      mockHandleIncomingMessage.mockResolvedValue()

      await handler(mockContext, jest.fn())

      const props = {
        service: mockService,
        ctx: mockContext,
        currStep: { config: { type: StepType.TEXT } },
      } as unknown as StepProps<Message.TextMessage>

      const [[,, valueBuilder]] = mockHandleIncomingMessage.mock.calls
      valueBuilder(props)

      expect(mockContext.t).toHaveBeenCalledTimes(0)
    })
  })

  describe('stepValueBuilder', () => {
    it('should build value correctly', async () => {
      mockHandleIncomingMessage.mockResolvedValue()

      await handler(mockContext, jest.fn())

      const props = { message: { text: 'message_text' } } as unknown as StepProps<Message.TextMessage>

      const [[,,, valueBuilder]] = mockHandleIncomingMessage.mock.calls
      const result = await valueBuilder(props)

      expect(result).toEqual('message_text')
    })
  })
})

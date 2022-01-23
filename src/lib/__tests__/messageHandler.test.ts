import { Update } from 'telegraf/typings/core/types/typegram'

import { DecoratedContext } from '../../models/DecoratedContext'
import { getMockContext, getMockFastify, mockLogger } from '../../utils/testUtils'
import * as interactionHandler from '../interactionHandler'
import { handleIncomingMessage } from '../messageHandler'
import * as replyComposer from '../replyComposer'

describe('Message Handler', () => {
  const mockUpdateInteraction = jest.spyOn(interactionHandler, 'updateInteraction').mockResolvedValue()
  const mockComposeReply = jest.spyOn(replyComposer, 'composeReply').mockReturnValue(['reply_arg'])

  it('should handle message correctly', async () => {
    const mockService = getMockFastify()

    const mockContext = getMockContext({ message: 'message', currStep: { foo: 'bar' } }) as DecoratedContext<Update.MessageUpdate>

    const mockStepValidator = jest.fn()
    const mockStepValueBuilder = jest.fn().mockResolvedValue('step_value')

    await handleIncomingMessage(mockService, mockContext, mockStepValidator, mockStepValueBuilder)

    const expectedStepProps = { service: mockService, ctx: mockContext, currStep: { foo: 'bar' }, message: 'message' }

    expect(mockStepValidator).toHaveBeenCalledTimes(1)
    expect(mockStepValidator).toHaveBeenCalledWith(expectedStepProps)

    expect(mockStepValueBuilder).toHaveBeenCalledTimes(1)
    expect(mockStepValueBuilder).toHaveBeenCalledWith(expectedStepProps)

    expect(mockUpdateInteraction).toHaveBeenCalledTimes(1)
    expect(mockUpdateInteraction).toHaveBeenCalledWith(mockService, mockContext, 'step_value')

    expect(mockComposeReply).toHaveBeenCalledTimes(1)
    expect(mockComposeReply).toHaveBeenCalledWith(mockLogger, mockContext)

    expect(mockContext.reply).toHaveBeenCalledTimes(1)
    expect(mockContext.reply).toHaveBeenCalledWith('reply_arg')
  })
})

import { MiddlewareFn } from 'telegraf'

import * as messageHandler from '../../lib/messageHandler'
import { DecoratedContext } from '../../models/DecoratedContext'
import { ProcessError } from '../../utils/Errors'
import { getMockContext, getMockFastify } from '../../utils/testUtils'
import { buildSkipCommandHandler } from '../skipCommandHandler'

describe('Skip command handler', () => {
  const mockHandleIncomingMessage = jest.spyOn(messageHandler, 'handleIncomingMessage')

  const mockService = getMockFastify()

  let handler: MiddlewareFn<DecoratedContext>

  beforeEach(() => { handler = buildSkipCommandHandler(mockService) as MiddlewareFn<DecoratedContext> })

  it('should throw if step cannot be skipped', async () => {
    const mockContext = getMockContext({ currStep: { skippable: false } })

    const executor = handler(mockContext, jest.fn())
    await expect(executor)
      .rejects
      .toEqual(new ProcessError('Step cannot be skipped', 'translation_errors.stepCannotBeSkipped'))

    expect(mockHandleIncomingMessage).toHaveBeenCalledTimes(0)
  })

  it('should skip step correctly', async () => {
    mockHandleIncomingMessage.mockResolvedValue(undefined)

    const mockContext = getMockContext({ currStep: { skippable: true } })
    await handler(mockContext, jest.fn())

    expect(mockHandleIncomingMessage).toHaveBeenCalledTimes(1)
    expect(mockHandleIncomingMessage).toHaveBeenCalledWith(
      mockService,
      mockContext,
      expect.any(Function),
      expect.any(Function),
    )
  })
})

import { MiddlewareFn } from 'telegraf'

import * as replyComposer from '../../lib/replyComposer'
import { DecoratedContext } from '../../models/DecoratedContext'
import { ProcessError } from '../../utils/Errors'
import { getMockContext, getMockFastify, getMockDataStorageClient } from '../../utils/testUtils'
import { buildAbortCommandHandler } from '../abortCommandHandler'

describe('Abort command handler', () => {
  const mockComposeLocalizedReply = jest.spyOn(replyComposer, 'composeLocalizedReply')

  const mockAbortInteraction = jest.fn()
  const mockStorageClient = getMockDataStorageClient({ abortInteraction: mockAbortInteraction })

  const mockService = getMockFastify({ dataStorageClient: mockStorageClient })

  const interaction = { id: 'interaction_id' }

  let handler: MiddlewareFn<DecoratedContext>

  beforeEach(() => { handler = buildAbortCommandHandler(mockService) as MiddlewareFn<DecoratedContext> })

  it('should throw if cannot abort interaction', async () => {
    mockAbortInteraction.mockRejectedValue(new Error('error'))

    const mockContext = getMockContext({ interaction })

    const executor = handler(mockContext, jest.fn())
    await expect(executor)
      .rejects
      .toEqual(new ProcessError('Error aborting interaction', 'translation_errors.abortInteraction'))

    expect(mockStorageClient.abortInteraction).toHaveBeenCalledTimes(1)
    expect(mockStorageClient.abortInteraction).toHaveBeenCalledWith('interaction_id')

    expect(mockComposeLocalizedReply).toHaveBeenCalledTimes(0)
    expect(mockContext.reply).toHaveBeenCalledTimes(0)
  })

  it('should abort interaction correctly', async () => {
    mockAbortInteraction.mockResolvedValue(undefined)
    mockComposeLocalizedReply.mockReturnValue(['question'])

    const mockContext = getMockContext({ interaction })
    await handler(mockContext, jest.fn())

    expect(mockStorageClient.abortInteraction).toHaveBeenCalledTimes(1)
    expect(mockStorageClient.abortInteraction).toHaveBeenCalledWith('interaction_id')

    expect(mockComposeLocalizedReply).toHaveBeenCalledTimes(1)
    expect(mockComposeLocalizedReply).toHaveBeenCalledWith(mockContext, 'events.interactionAborted')

    expect(mockContext.reply).toHaveBeenCalledTimes(1)
    expect(mockContext.reply).toHaveBeenCalledWith('question')
  })
})

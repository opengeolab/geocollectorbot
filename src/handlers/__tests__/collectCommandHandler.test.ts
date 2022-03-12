import { MiddlewareFn } from 'telegraf'

import * as replyComposer from '../../lib/replyComposer'
import { DecoratedContext } from '../../models/DecoratedContext'
import { ProcessError } from '../../utils/Errors'
import { getMockContext, getMockFastify, getMockDataStorageClient } from '../../utils/testUtils'
import { buildCollectCommandHandler } from '../collectCommandHandler'

describe('Collect command handler', () => {
  const mockComposeReply = jest.spyOn(replyComposer, 'composeReply')

  const mockGetOngoingInteractions = jest.fn()
  const mockCreateInteraction = jest.fn()

  const mockStorageClient = getMockDataStorageClient({
    createInteraction: mockCreateInteraction,
    getOngoingInteractions: mockGetOngoingInteractions,
  })

  const mockService = getMockFastify({
    dataStorageClient: mockStorageClient,
    configuration: { flow: { firstStepId: 'first_step', steps: { first_step: { question: 'first_question' } } } },
  })

  let handler: MiddlewareFn<DecoratedContext>

  beforeEach(() => { handler = buildCollectCommandHandler(mockService) as MiddlewareFn<DecoratedContext> })

  it('should throw if cannot retrieve ongoing interactions', async () => {
    mockGetOngoingInteractions.mockRejectedValue(new Error('error'))

    const mockContext = getMockContext()

    const executor = handler(mockContext, jest.fn())
    await expect(executor)
      .rejects
      .toEqual(new ProcessError('Error retrieving ongoing interaction', 'translation_errors.createInteraction'))

    expect(mockGetOngoingInteractions).toHaveBeenCalledTimes(1)
    expect(mockGetOngoingInteractions).toHaveBeenCalledWith('chat_id')

    expect(mockCreateInteraction).toHaveBeenCalledTimes(0)
    expect(mockComposeReply).toHaveBeenCalledTimes(0)
    expect(mockContext.reply).toHaveBeenCalledTimes(0)
  })

  it('should throw if ongoing interaction already exists', async () => {
    mockGetOngoingInteractions.mockResolvedValue([{ id: 'ongoing_interaction' }])

    const mockContext = getMockContext()

    const executor = handler(mockContext, jest.fn())
    await expect(executor)
      .rejects
      .toEqual(new ProcessError('An ongoing interaction already exists', 'translation_errors.ongoingInteractionAlreadyExists'))

    expect(mockGetOngoingInteractions).toHaveBeenCalledTimes(1)
    expect(mockGetOngoingInteractions).toHaveBeenCalledWith('chat_id')

    expect(mockCreateInteraction).toHaveBeenCalledTimes(0)
    expect(mockComposeReply).toHaveBeenCalledTimes(0)
    expect(mockContext.reply).toHaveBeenCalledTimes(0)
  })

  it('should throw if cannot create interaction', async () => {
    mockGetOngoingInteractions.mockResolvedValue([])
    mockCreateInteraction.mockRejectedValue(new Error('error'))

    const mockContext = getMockContext()

    const executor = handler(mockContext, jest.fn())
    await expect(executor)
      .rejects
      .toEqual(new ProcessError('Error creating new interaction', 'translation_errors.createInteraction'))

    expect(mockGetOngoingInteractions).toHaveBeenCalledTimes(1)
    expect(mockGetOngoingInteractions).toHaveBeenCalledWith('chat_id')

    expect(mockStorageClient.createInteraction).toHaveBeenCalledTimes(1)
    expect(mockStorageClient.createInteraction).toHaveBeenCalledWith('chat_id', undefined, 'first_step')

    expect(mockComposeReply).toHaveBeenCalledTimes(0)
    expect(mockContext.reply).toHaveBeenCalledTimes(0)
  })

  it('should send first question', async () => {
    mockGetOngoingInteractions.mockResolvedValue([])
    mockCreateInteraction.mockResolvedValue(undefined)
    mockComposeReply.mockReturnValue(['question'])

    const mockContext = getMockContext({ from: { username: 'user_name' } })
    await handler(mockContext, jest.fn())

    expect(mockStorageClient.createInteraction).toHaveBeenCalledTimes(1)
    expect(mockStorageClient.createInteraction).toHaveBeenCalledWith('chat_id', 'user_name', 'first_step')

    expect(mockContext.nextStep).toStrictEqual({ question: 'first_question' })

    expect(mockGetOngoingInteractions).toHaveBeenCalledTimes(1)
    expect(mockGetOngoingInteractions).toHaveBeenCalledWith('chat_id')

    expect(mockComposeReply).toHaveBeenCalledTimes(1)
    expect(mockComposeReply).toHaveBeenCalledWith(mockService.log, mockContext)

    expect(mockContext.reply).toHaveBeenCalledTimes(1)
    expect(mockContext.reply).toHaveBeenCalledWith('question')
  })
})

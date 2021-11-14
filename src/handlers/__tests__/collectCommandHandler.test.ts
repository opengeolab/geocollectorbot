import {MiddlewareFn} from 'telegraf'

import * as questionComposer from '../../lib/questionComposer'
import {DecoratedContext} from '../../models/DecoratedContext'
import {ProcessError} from '../../utils/Errors'
import {getMockContext, getMockFastify, getMockStorageClient} from '../../utils/testUtils'
import {buildCollectCommandHandler} from '../collectCommandHandler'

describe('Collect command handler', () => {
  const mockComposeQuestion = jest.spyOn(questionComposer, 'composeQuestion')

  const mockCreateInteraction = jest.fn()
  const mockStorageClient = getMockStorageClient({createInteraction: mockCreateInteraction})

  const mockService = getMockFastify({
    storageClient: mockStorageClient,
    configuration: {flow: {firstStepId: 'first_step', steps: {first_step: {question: 'first_question'}}}},
  })

  let handler: MiddlewareFn<DecoratedContext>

  beforeEach(() => { handler = buildCollectCommandHandler(mockService) as MiddlewareFn<DecoratedContext> })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('should throw if cannot create interaction', async () => {
    mockCreateInteraction.mockRejectedValue(new Error('error'))

    const mockContext = getMockContext()

    try {
      await handler(mockContext, jest.fn())
      expect(true).toBeFalsy()
    } catch (err: any) {
      expect(err).toBeInstanceOf(ProcessError)
      expect(err.message).toEqual('Error creating new interaction')
      expect(err.reply).toEqual('translation_errors.createInteraction')
    }

    expect(mockStorageClient.createInteraction).toHaveBeenCalledTimes(1)
    expect(mockStorageClient.createInteraction).toHaveBeenCalledWith('chat_id', 'first_step')

    expect(mockComposeQuestion).toHaveBeenCalledTimes(0)
    expect(mockContext.reply).toHaveBeenCalledTimes(0)
  })

  it('should send first question', async () => {
    mockCreateInteraction.mockResolvedValue(undefined)
    mockComposeQuestion.mockReturnValue('question')

    const mockContext = getMockContext()
    await handler(mockContext, jest.fn())

    expect(mockStorageClient.createInteraction).toHaveBeenCalledTimes(1)
    expect(mockStorageClient.createInteraction).toHaveBeenCalledWith('chat_id', 'first_step')

    expect(mockContext.nextStep).toStrictEqual({question: 'first_question'})

    expect(mockComposeQuestion).toHaveBeenCalledTimes(1)
    expect(mockComposeQuestion).toHaveBeenCalledWith(mockService.log, mockContext)

    expect(mockContext.reply).toHaveBeenCalledTimes(1)
    expect(mockContext.reply).toHaveBeenCalledWith('question')
  })
})

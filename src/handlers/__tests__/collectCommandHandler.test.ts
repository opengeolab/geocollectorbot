import {MiddlewareFn} from 'telegraf'

import {DecoratedContext} from '../../models/DecoratedContext'
import {ProcessError} from '../../utils/Errors'
import * as localizer from '../../utils/localizer'
import {getMockContext, getMockFastify, getMockStorageClient} from '../../utils/testUtils'
import {buildCollectCommandHandler} from '../collectCommandHandler'

describe('Collect command handler', () => {
  const mockResolveLocalizedText = jest.spyOn(localizer, 'resolveLocalizedText')

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

    expect(mockResolveLocalizedText).toHaveBeenCalledTimes(0)
    expect(mockContext.reply).toHaveBeenCalledTimes(0)
  })

  it('should send the first question without locale', async () => {
    mockCreateInteraction.mockResolvedValue(undefined)
    mockResolveLocalizedText.mockReturnValue('localized_question')

    const mockContext = getMockContext()
    await handler(mockContext, jest.fn())

    expect(mockStorageClient.createInteraction).toHaveBeenCalledTimes(1)
    expect(mockStorageClient.createInteraction).toHaveBeenCalledWith('chat_id', 'first_step')

    expect(mockResolveLocalizedText).toHaveBeenCalledTimes(1)
    expect(mockResolveLocalizedText).toHaveBeenCalledWith('first_question', undefined)

    expect(mockContext.reply).toHaveBeenCalledTimes(1)
    expect(mockContext.reply).toHaveBeenCalledWith('localized_question')
  })

  it('should send the first question with locale', async () => {
    mockCreateInteraction.mockResolvedValue(undefined)
    mockResolveLocalizedText.mockReturnValue('localized_question')

    const mockContext = getMockContext({from: {language_code: 'fr'}})
    await handler(mockContext, jest.fn())

    expect(mockStorageClient.createInteraction).toHaveBeenCalledTimes(1)
    expect(mockStorageClient.createInteraction).toHaveBeenCalledWith('chat_id', 'first_step')

    expect(mockResolveLocalizedText).toHaveBeenCalledTimes(1)
    expect(mockResolveLocalizedText).toHaveBeenCalledWith('first_question', 'fr')

    expect(mockContext.reply).toHaveBeenCalledTimes(1)
    expect(mockContext.reply).toHaveBeenCalledWith('localized_question')
  })
})

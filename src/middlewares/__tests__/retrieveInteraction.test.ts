import { MiddlewareFn } from 'telegraf'

import { DecoratedContext } from '../../models/DecoratedContext'
import { BaseInteractionKeys } from '../../models/Interaction'
import { ProcessError } from '../../utils/Errors'
import { getMockContext, getMockFastify, getMockDataStorageClient } from '../../utils/testUtils'
import { buildRetrieveInteractionMiddleware } from '../retrieveInteraction'

describe('Retrieve interaction middleware', () => {
  const mockNext = jest.fn()

  const mockGetOngoingInteractions = jest.fn()
  const mockStorageClient = getMockDataStorageClient({ getOngoingInteractions: mockGetOngoingInteractions })

  const mockService = getMockFastify({
    dataStorageClient: mockStorageClient,
    configuration: { flow: { steps: { step_1: { question: 'question_1', nextStepId: 'step_2' }, step_2: { question: 'question_2' } } } },
  })

  let middleware: MiddlewareFn<DecoratedContext>

  beforeEach(() => { middleware = buildRetrieveInteractionMiddleware(mockService) })

  it('should throw if getOngoingInteractions throws', async () => {
    mockGetOngoingInteractions.mockRejectedValue(new Error('error'))

    const mockCtx = getMockContext()

    try {
      await middleware(mockCtx, mockNext)
      expect(true).toBeFalsy()
    } catch (error: any) {
      expect(error).toBeInstanceOf(ProcessError)
      expect(error.message).toEqual('Error retrieving ongoing interaction')
      expect(error.reply).toEqual('translation_errors.retrieveInteraction')
    }

    expect(mockNext).toHaveBeenCalledTimes(0)
    expect(mockCtx.t).toHaveBeenCalledTimes(1)
    expect(mockCtx.t).toHaveBeenCalledWith('errors.retrieveInteraction')
  })

  it('should throw if no interactions found', async () => {
    mockGetOngoingInteractions.mockReturnValue([])

    const mockCtx = getMockContext()

    try {
      await middleware(mockCtx, mockNext)
      expect(true).toBeFalsy()
    } catch (error: any) {
      expect(error).toBeInstanceOf(ProcessError)
      expect(error.message).toEqual('No ongoing interaction found')
      expect(error.reply).toEqual('translation_errors.noInteractionsFound')
    }

    expect(mockNext).toHaveBeenCalledTimes(0)
    expect(mockCtx.t).toHaveBeenCalledTimes(1)
    expect(mockCtx.t).toHaveBeenCalledWith('errors.noInteractionsFound')
  })

  it('should throw if no more than one interaction found', async () => {
    mockGetOngoingInteractions.mockReturnValue([{ foo: 'bar' }, { foo: 'bar' }])

    const mockCtx = getMockContext()

    try {
      await middleware(mockCtx, mockNext)
      expect(true).toBeFalsy()
    } catch (error: any) {
      expect(error).toBeInstanceOf(ProcessError)
      expect(error.message).toEqual('Too many ongoing interactions found')
      expect(error.reply).toEqual('translation_errors.tooManyInteractionsFound')
    }

    expect(mockNext).toHaveBeenCalledTimes(0)
    expect(mockCtx.t).toHaveBeenCalledTimes(1)
    expect(mockCtx.t).toHaveBeenCalledWith('errors.tooManyInteractionsFound')
  })

  it('should throw if current step not found', async () => {
    const interaction = { [BaseInteractionKeys.CURRENT_STEP_ID]: 'step_3' }
    mockGetOngoingInteractions.mockReturnValue([interaction])

    const mockCtx = getMockContext()

    try {
      await middleware(mockCtx, mockNext)
      expect(true).toBeFalsy()
    } catch (error: any) {
      expect(error).toBeInstanceOf(ProcessError)
      expect(error.message).toEqual('Current step not found')
      expect(error.reply).toEqual('translation_errors.unknownStep')
    }

    expect(mockNext).toHaveBeenCalledTimes(0)
    expect(mockCtx.t).toHaveBeenCalledTimes(1)
    expect(mockCtx.t).toHaveBeenCalledWith('errors.unknownStep')
  })

  it('should decorate with next step', async () => {
    const interaction = { [BaseInteractionKeys.CURRENT_STEP_ID]: 'step_1' }
    mockGetOngoingInteractions.mockReturnValue([interaction])

    const mockCtx = getMockContext()
    await middleware(mockCtx, mockNext)

    expect(mockCtx.interaction).toEqual(interaction)
    expect(mockCtx.currStep).toStrictEqual({ question: 'question_1', nextStepId: 'step_2' })
    expect(mockCtx.nextStep).toEqual({ question: 'question_2' })

    expect(mockNext).toHaveBeenCalledTimes(1)
    expect(mockCtx.t).toHaveBeenCalledTimes(0)
  })

  it('should decorate without next step', async () => {
    const interaction = { [BaseInteractionKeys.CURRENT_STEP_ID]: 'step_2' }
    mockGetOngoingInteractions.mockReturnValue([interaction])

    const mockCtx = getMockContext()
    await middleware(mockCtx, mockNext)

    expect(mockCtx.interaction).toEqual(interaction)
    expect(mockCtx.currStep).toStrictEqual({ question: 'question_2' })
    expect(mockCtx.nextStep).toBeUndefined()

    expect(mockNext).toHaveBeenCalledTimes(1)
    expect(mockCtx.t).toHaveBeenCalledTimes(0)
  })
})

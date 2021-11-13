import {MiddlewareFn} from 'telegraf'

import {DecoratedContext} from '../../models/DecoratedContext'
import {ProcessError} from '../../utils/Errors'
import {getMockContext, getMockFastify, getMockStorageClient} from '../../utils/testUtils'
import {buildRetrieveInteractionMiddleware} from '../retrieveInteraction'

describe('Retrieve interaction middleware', () => {
  const mockNext = jest.fn()

  const mockGetOngoingInteractions = jest.fn()
  const mockStorageClient = getMockStorageClient({getOngoingInteractions: mockGetOngoingInteractions})

  const mockService = getMockFastify({storageClient: mockStorageClient})

  let middleware: MiddlewareFn<DecoratedContext>

  beforeEach(() => { middleware = buildRetrieveInteractionMiddleware(mockService) })

  afterEach(() => jest.clearAllMocks())

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
    mockGetOngoingInteractions.mockReturnValue([{foo: 'bar'}, {foo: 'bar'}])

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

  it('should add interaction to context', async () => {
    const interaction = {foo: 'bar'}
    mockGetOngoingInteractions.mockReturnValue([interaction])

    const mockCtx = getMockContext()
    await middleware(mockCtx, mockNext)

    expect(mockCtx.interaction).toEqual(interaction)
    expect(mockNext).toHaveBeenCalledTimes(1)
    expect(mockCtx.t).toHaveBeenCalledTimes(0)
  })
})

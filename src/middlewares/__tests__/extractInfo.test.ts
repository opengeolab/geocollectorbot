import {MiddlewareFn} from 'telegraf'

import {DecoratedContext} from '../../models/DecoratedContext'
import {ProcessError} from '../../utils/Errors'
import {getMockContext, getMockFastify} from '../../utils/testUtils'
import {buildExtractInfoMiddleware} from '../extractInfo'

describe('Extract info middleware', () => {
  const mockNext = jest.fn()

  const mockService = getMockFastify()

  let middleware: MiddlewareFn<DecoratedContext>

  beforeEach(() => { middleware = buildExtractInfoMiddleware(mockService) })

  afterEach(() => jest.clearAllMocks())

  it('should throw if chat id not found', () => {
    const mockCtx = getMockContext()

    try {
      middleware(mockCtx, mockNext)
      expect(true).toBeFalsy()
    } catch (error: any) {
      expect(error).toBeInstanceOf(ProcessError)
      expect(error.message).toEqual('Cannot find chat id')
      expect(error.reply).toEqual('translation_errors.chatIdNotFound')
    }

    expect(mockNext).toHaveBeenCalledTimes(0)
    expect(mockCtx.t).toHaveBeenCalledTimes(1)
    expect(mockCtx.t).toHaveBeenCalledWith('errors.chatIdNotFound')
  })

  it('should add chat id to context', () => {
    const mockCtx = getMockContext({chat: {id: 'chat_id'}})
    middleware(mockCtx, mockNext)

    expect(mockCtx.chatId).toEqual('chat_id')
    expect(mockNext).toHaveBeenCalledTimes(1)
    expect(mockCtx.t).toHaveBeenCalledTimes(0)
  })
})

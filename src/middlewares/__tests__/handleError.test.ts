import {MaybePromise} from 'telegraf/typings/composer'

import {DecoratedContext} from '../../models/DecoratedContext'
import {ProcessError} from '../../utils/Errors'
import {getMockContext, getMockFastify} from '../../utils/testUtils'
import {buildHandleErrorMiddleware} from '../handleError'

describe('Handle error middleware', () => {
  const mockService = getMockFastify()

  let middleware: (error: unknown, ctx: DecoratedContext) => MaybePromise<void>

  beforeEach(() => { middleware = buildHandleErrorMiddleware(mockService) })

  afterEach(() => jest.clearAllMocks())

  it('should exit process if instanceof is not Error', async () => {
    const mockCtx = getMockContext()

    try {
      await middleware('not_error', mockCtx)
      expect(true).toBeFalsy()
    } catch (err: any) {
      expect(err.message).toEqual('Caught error is not an Error, exiting process')
    }

    expect(process.exitCode).toEqual(1)
    expect(mockCtx.reply).toHaveBeenCalledTimes(0)
  })

  it('should exit process timout error', async () => {
    const mockCtx = getMockContext()

    const error = new Error('timeout')
    error.name = 'TimeoutError'

    try {
      await middleware(error, mockCtx)
      expect(true).toBeFalsy()
    } catch (err: any) {
      expect(err).toEqual(error)
    }

    expect(process.exitCode).toEqual(1)
    expect(mockCtx.reply).toHaveBeenCalledTimes(0)
  })

  it('should reply if process error', async () => {
    const mockCtx = getMockContext()

    const error = new ProcessError('process_error', 'process_error_reply')

    try {
      await middleware(error, mockCtx)
      expect(true).toBeFalsy()
    } catch (err: any) {
      expect(mockCtx.reply).toHaveBeenCalledTimes(1)
      expect(mockCtx.reply).toHaveBeenCalledWith('process_error_reply')
    }
  })

  it('should reply if unknown error', async () => {
    const mockCtx = getMockContext()

    const error = new Error('unknown_error')

    try {
      await middleware(error, mockCtx)
      expect(true).toBeFalsy()
    } catch (err: any) {
      expect(mockCtx.reply).toHaveBeenCalledTimes(1)
      expect(mockCtx.reply).toHaveBeenCalledWith('translation_errors.unknown')
    }

    expect(mockCtx.t).toHaveBeenCalledTimes(1)
    expect(mockCtx.t).toHaveBeenCalledWith('errors.unknown')
  })
})

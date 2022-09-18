import { MiddlewareFn } from 'telegraf'

import { DecoratedContext } from '../../models/DecoratedContext'
import { ProcessError } from '../../utils/Errors'
import { getMockContext, getMockFastify } from '../../utils/testUtils'
import { buildUnsupportedUpdateMiddleware } from '../unsupportedUpdate'

describe('Unsupported update middleware', () => {
  const mockNext = jest.fn()

  const mockService = getMockFastify()

  let middleware: MiddlewareFn<DecoratedContext>

  beforeEach(() => { middleware = buildUnsupportedUpdateMiddleware(mockService) })

  it('should throw', () => {
    const mockCtx = getMockContext()

    expect(() => middleware(mockCtx, mockNext)).toThrow(new ProcessError(
      'Current update type not supported',
      'translation_errors.unsupportedUpdateType'
    ))

    expect(mockNext).toHaveBeenCalledTimes(0)
    expect(mockCtx.t).toHaveBeenCalledTimes(1)
    expect(mockCtx.t).toHaveBeenCalledWith('errors.unsupportedUpdateType')
  })
})

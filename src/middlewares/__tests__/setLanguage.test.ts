import { FastifyInstance } from 'fastify'
import { i18n } from 'i18next'
import { MiddlewareFn } from 'telegraf'

import { DecoratedContext } from '../../models/DecoratedContext'
import { DEFAULT_LANGUAGE } from '../../utils/constants'
import { getMockContext, mockLogger } from '../../utils/testUtils'
import { buildSetLanguageMiddleware } from '../setLanguage'

describe('Set language middleware', () => {
  const mockNext = jest.fn()

  const mockI18n: Partial<i18n> = { getFixedT: jest.fn().mockReturnValue('getFixedT') }

  const mockService = { log: mockLogger, i18n: mockI18n } as unknown as FastifyInstance

  let middleware: MiddlewareFn<DecoratedContext>

  beforeEach(() => { middleware = buildSetLanguageMiddleware(mockService) })

  it('should use user language if found', () => {
    const mockCtx = getMockContext({ from: { language_code: 'fr' } })
    middleware(mockCtx, mockNext)

    expect(mockCtx.lang).toEqual('fr')
    expect(mockCtx.t).toEqual('getFixedT')

    expect(mockI18n.getFixedT).toHaveBeenCalledTimes(1)
    expect(mockI18n.getFixedT).toHaveBeenCalledWith('fr')
  })

  it('should use default language if user language not found', () => {
    const mockCtx = getMockContext({ chat: { id: 'chatId' } })
    middleware(mockCtx, mockNext)

    expect(mockCtx.lang).toEqual(DEFAULT_LANGUAGE)
    expect(mockCtx.t).toEqual('getFixedT')

    expect(mockI18n.getFixedT).toHaveBeenCalledTimes(1)
    expect(mockI18n.getFixedT).toHaveBeenCalledWith(DEFAULT_LANGUAGE)
  })
})

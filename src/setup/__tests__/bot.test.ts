import * as telegraf from 'telegraf'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'

import * as handlers from '../../handlers'
import * as middlewares from '../../middlewares'
import { baseEnv, getMockFastify } from '../../utils/testUtils'
import { buildBot } from '../bot'

describe('Bot', () => {
  const mockBot = {
    use: jest.fn(),
    start: jest.fn(),
    help: jest.fn(),
    command: jest.fn(),
    on: jest.fn(),
    action: jest.fn(),
    catch: jest.fn(),
  }

  mockBot.start.mockReturnValue(mockBot)
  mockBot.help.mockReturnValue(mockBot)
  mockBot.command.mockReturnValue(mockBot)
  mockBot.on.mockReturnValue(mockBot)
  mockBot.use.mockReturnValue(mockBot)
  mockBot.action.mockReturnValue(mockBot)
  mockBot.catch.mockReturnValue(mockBot)

  const mockTelegraf = jest.spyOn(telegraf, 'Telegraf').mockReturnValue(mockBot as unknown as Telegraf<Context<Update>>)

  const mockSetLanguageMiddleware = jest.fn()
  const mockBuildSetLanguageMiddleware = jest.spyOn(middlewares, 'buildSetLanguageMiddleware').mockReturnValue(mockSetLanguageMiddleware)

  const mockStartCommandHandler = jest.fn()
  const mockBuildStartCommandHandler = jest.spyOn(handlers, 'buildStartCommandHandler').mockReturnValue(mockStartCommandHandler)

  const mockHelpCommandHandler = jest.fn()
  const mockBuildHelpCommandHandler = jest.spyOn(handlers, 'buildHelpCommandHandler').mockReturnValue(mockHelpCommandHandler)

  const mockExtractInfoMiddleware = jest.fn()
  const mockBuildExtractInfoMiddleware = jest.spyOn(middlewares, 'buildExtractInfoMiddleware').mockReturnValue(mockExtractInfoMiddleware)

  const mockCollectCommandHandler = jest.fn()
  const mockBuildCollectCommandHandler = jest.spyOn(handlers, 'buildCollectCommandHandler').mockReturnValue(mockCollectCommandHandler)

  const mockRetrieveInteractionMiddleware = jest.fn()
  const mockBuildRetrieveInteractionMiddleware = jest.spyOn(middlewares, 'buildRetrieveInteractionMiddleware').mockReturnValue(mockRetrieveInteractionMiddleware)

  const mockAbortCommandHandler = jest.fn()
  const mockBuildAbortCommandHandler = jest.spyOn(handlers, 'buildAbortCommandHandler').mockReturnValue(mockAbortCommandHandler)

  const mockTextHandler = jest.fn()
  const mockBuildTextHandler = jest.spyOn(handlers, 'buildTextHandler').mockReturnValue(mockTextHandler)

  const mockCallbackQueryHandler = jest.fn()
  const mockBuildCallbackQueryHandler = jest.spyOn(handlers, 'buildCallbackQueryHandler').mockReturnValue(mockCallbackQueryHandler)

  const mockLocationHandler = jest.fn()
  const mockBuildLocationHandler = jest.spyOn(handlers, 'buildLocationHandler').mockReturnValue(mockLocationHandler)

  const mockPhotoHandler = jest.fn()
  const mockBuildPhotoHandler = jest.spyOn(handlers, 'buildPhotoHandler').mockReturnValue(mockPhotoHandler)

  const mockHandleErrorMiddleware = jest.fn()
  const mockBuildHandleErrorMiddleware = jest.spyOn(middlewares, 'buildHandleErrorMiddleware').mockReturnValue(mockHandleErrorMiddleware)

  const mockService = getMockFastify()

  it('should build bot', async () => {
    const result = buildBot(mockService)
    expect(result).toEqual(mockBot)

    expect(mockTelegraf).toHaveBeenCalledTimes(1)
    expect(mockTelegraf).toHaveBeenCalledWith(baseEnv.TELEGRAM_AUTH_TOKEN)

    expect(mockBot.use).toHaveBeenCalledTimes(3)
    expect(mockBot.use).toHaveBeenNthCalledWith(1, mockSetLanguageMiddleware)
    expect(mockBot.use).toHaveBeenNthCalledWith(2, mockExtractInfoMiddleware)
    expect(mockBot.use).toHaveBeenNthCalledWith(3, mockRetrieveInteractionMiddleware)

    expect(mockBot.start).toHaveBeenCalledTimes(1)
    expect(mockBot.start).toHaveBeenCalledWith(mockStartCommandHandler)

    expect(mockBot.help).toHaveBeenCalledTimes(1)
    expect(mockBot.help).toHaveBeenCalledWith(mockHelpCommandHandler)

    expect(mockBot.command).toHaveBeenCalledTimes(2)
    expect(mockBot.command).toHaveBeenNthCalledWith(1, 'collect', mockCollectCommandHandler)
    expect(mockBot.command).toHaveBeenNthCalledWith(2, 'abort', mockAbortCommandHandler)

    expect(mockBot.on).toHaveBeenCalledTimes(3)
    expect(mockBot.on).toHaveBeenNthCalledWith(1, 'text', mockTextHandler)
    expect(mockBot.on).toHaveBeenNthCalledWith(2, 'location', mockLocationHandler)
    expect(mockBot.on).toHaveBeenNthCalledWith(3, 'photo', mockPhotoHandler)

    expect(mockBot.action).toHaveBeenCalledTimes(1)
    expect(mockBot.action).toHaveBeenCalledWith(/^mcq::/, mockCallbackQueryHandler)

    expect(mockBot.catch).toHaveBeenCalledTimes(1)
    expect(mockBot.catch).toHaveBeenCalledWith(mockHandleErrorMiddleware)

    expect(mockBuildSetLanguageMiddleware).toHaveBeenCalledTimes(1)
    expect(mockBuildSetLanguageMiddleware).toHaveBeenCalledWith(mockService)

    expect(mockBuildStartCommandHandler).toHaveBeenCalledTimes(1)
    expect(mockBuildStartCommandHandler).toHaveBeenCalledWith(mockService)

    expect(mockBuildHelpCommandHandler).toHaveBeenCalledTimes(1)
    expect(mockBuildHelpCommandHandler).toHaveBeenCalledWith(mockService)

    expect(mockBuildExtractInfoMiddleware).toHaveBeenCalledTimes(1)
    expect(mockBuildExtractInfoMiddleware).toHaveBeenCalledWith(mockService)

    expect(mockBuildCollectCommandHandler).toHaveBeenCalledTimes(1)
    expect(mockBuildCollectCommandHandler).toHaveBeenCalledWith(mockService)

    expect(mockBuildRetrieveInteractionMiddleware).toHaveBeenCalledTimes(1)
    expect(mockBuildRetrieveInteractionMiddleware).toHaveBeenCalledWith(mockService)

    expect(mockBuildAbortCommandHandler).toHaveBeenCalledTimes(1)
    expect(mockBuildAbortCommandHandler).toHaveBeenCalledWith(mockService)

    expect(mockBuildTextHandler).toHaveBeenCalledTimes(1)
    expect(mockBuildTextHandler).toHaveBeenCalledWith(mockService)

    expect(mockBuildCallbackQueryHandler).toHaveBeenCalledTimes(1)
    expect(mockBuildCallbackQueryHandler).toHaveBeenCalledWith(mockService)

    expect(mockBuildLocationHandler).toHaveBeenCalledTimes(1)
    expect(mockBuildLocationHandler).toHaveBeenCalledWith(mockService)

    expect(mockBuildPhotoHandler).toHaveBeenCalledTimes(1)
    expect(mockBuildPhotoHandler).toHaveBeenCalledWith(mockService)

    expect(mockBuildHandleErrorMiddleware).toHaveBeenCalledTimes(1)
    expect(mockBuildHandleErrorMiddleware).toHaveBeenCalledWith(mockService)
  })
})

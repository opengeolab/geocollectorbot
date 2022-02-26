import { FastifyInstance } from 'fastify'
import { Telegraf } from 'telegraf'

import {
  buildStartCommandHandler,
  buildCallbackQueryHandler,
  buildHelpCommandHandler,
  buildLocationHandler,
  buildPhotoHandler,
  buildTextHandler,
  buildCollectCommandHandler,
  buildAbortCommandHandler,
} from '../handlers'
import {
  buildSetLanguageMiddleware,
  buildExtractInfoMiddleware,
  buildRetrieveInteractionMiddleware,
  buildHandleErrorMiddleware,
} from '../middlewares'
import { DecoratedContext } from '../models/DecoratedContext'

export const buildBot = (service: FastifyInstance): Telegraf<DecoratedContext> => {
  const { env: { TELEGRAM_AUTH_TOKEN } } = service

  const bot = new Telegraf<DecoratedContext>(TELEGRAM_AUTH_TOKEN)

  bot
    .use(buildSetLanguageMiddleware(service))
    .start(buildStartCommandHandler(service))
    .help(buildHelpCommandHandler(service))
    //
    .use(buildExtractInfoMiddleware(service))
    .command('collect', buildCollectCommandHandler(service))
    //
    .use(buildRetrieveInteractionMiddleware(service))
    .command('abort', buildAbortCommandHandler(service))
    .on('text', buildTextHandler(service))
    .action(/^mcq::/, buildCallbackQueryHandler(service))
    .on('location', buildLocationHandler(service))
    .on('photo', buildPhotoHandler(service))
    //
    .catch(buildHandleErrorMiddleware(service))

  return bot
}

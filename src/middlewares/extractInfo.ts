import {DEFAULT_LANGUAGE} from '../constants'
import {MiddlewareBuilder} from '../models/Buildes'
import {ProcessError} from '../utils/Errors'

export const buildExtractInfoMiddleware: MiddlewareBuilder = ({log: logger}) => (ctx, next) => {
  const {chat, from: user} = ctx

  const chatId = chat?.id
  const lang = user?.language_code

  // TODO fix messages
  if (!chatId) {
    logger.error({chat}, 'Cannot find chat id')
    throw new ProcessError('Cannot find chat id', 'Cannot find chat id')
  }

  ctx.chatId = chatId
  ctx.lang = lang || DEFAULT_LANGUAGE

  return next()
}

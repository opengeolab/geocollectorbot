import {MiddlewareBuilder} from '../models/Buildes'
import {ProcessError} from '../utils/Errors'

export const buildExtractInfoMiddleware: MiddlewareBuilder = ({log: logger}) => (ctx, next) => {
  const {chat} = ctx

  const chatId = chat?.id

  // TODO fix messages
  if (!chatId) {
    logger.error({chat}, 'Cannot find chat id')
    throw new ProcessError(ctx.t('errors.chatIdNotFound'), 'Cannot find chat id')
  }

  ctx.chatId = chatId

  return next()
}

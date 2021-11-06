import {MiddlewareBuilder} from '../models/Buildes'
import {ProcessError} from '../utils/Errors'

export const buildExtractInfoMiddleware: MiddlewareBuilder = ({log: logger}) => (ctx, next) => {
  logger.trace({chatId: ctx.chat?.id}, 'Executing middleware "extractInfo"')

  const {chat} = ctx
  const chatId = chat?.id

  if (chatId) {
    ctx.chatId = chatId
    return next()
  }

  logger.error({chat}, 'Cannot find chat id')
  throw new ProcessError('Cannot find chat id', ctx.t('errors.chatIdNotFound'))
}

import {DEFAULT_LANGUAGE} from '../constants'
import {MiddlewareBuilder} from '../models/Buildes'

export const buildSetLanguageMiddleware: MiddlewareBuilder = ({log: logger, i18n}) => (ctx, next) => {
  const {from: user} = ctx

  const lang = user?.language_code || DEFAULT_LANGUAGE
  logger.trace({user, lang}, 'Set language for interaction')

  ctx.lang = lang
  ctx.t = i18n.getFixedT(lang)

  return next()
}

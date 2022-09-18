import { MiddlewareBuilder } from '../models/Buildes'
import { ProcessError } from '../utils/Errors'

export const buildUnsupportedUpdateMiddleware: MiddlewareBuilder = ({ log: logger }) => ctx => {
  logger.error('Update type not supported')
  throw new ProcessError('Current update type not supported', ctx.t('errors.unsupportedUpdateType'))
}

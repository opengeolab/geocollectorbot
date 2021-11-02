import {MiddlewareBuilder} from '../models/Buildes'
import {Interaction} from '../models/Interaction'
import {ProcessError} from '../utils/Errors'

export const buildRetrieveInteractionMiddleware: MiddlewareBuilder = ({log: logger, storageClient}) => async (ctx, next) => {
  const {chatId} = ctx

  let interactions: Interaction[]
  try {
    interactions = await storageClient.getOngoingInteractions(chatId)
  } catch (error: any) {
    // TODO set message
    throw new ProcessError(error.message, '')
  }

  if (interactions.length === 0) {
    // TODO set message
    throw new ProcessError('No ongoing interaction found', '')
  }

  if (interactions.length > 1) {
    // TODO set message
    throw new ProcessError('Too many interactions found', '')
  }

  const [interaction] = interactions
  logger.trace({chatId, interaction}, 'Found ongoing interaction')

  ctx.interaction = interaction

  return next()
}

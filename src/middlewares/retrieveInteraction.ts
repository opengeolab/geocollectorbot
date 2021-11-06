import {MiddlewareBuilder} from '../models/Buildes'
import {Interaction} from '../models/Interaction'
import {ProcessError} from '../utils/Errors'

export const buildRetrieveInteractionMiddleware: MiddlewareBuilder = ({log: logger, storageClient}) => async (ctx, next) => {
  const {chatId} = ctx
  logger.trace({chatId}, 'Executing middleware "retrieveInteraction"')

  let interactions: Interaction[]
  try {
    interactions = await storageClient.getOngoingInteractions(chatId)
  } catch (error: any) {
    logger.error({error, chatId}, 'Error retrieving ongoing interaction')
    throw new ProcessError('Error retrieving ongoing interaction', ctx.t('errors.retrieveInteraction'))
  }

  const interactionsCount = interactions.length

  if (interactionsCount === 0) {
    logger.error({chatId}, 'No ongoing interactions found')
    throw new ProcessError('No ongoing interaction found', ctx.t('errors.noInteractionsFound'))
  }

  // TODO handle the "too many interactions" case
  if (interactionsCount > 1) {
    logger.error({chatId, interactionsCount}, 'Too many ongoing interactions found')
    throw new ProcessError('Too many ongoing interactions found', ctx.t('errors.tooManyInteractionsFound'))
  }

  const [interaction] = interactions
  logger.trace({chatId, interaction}, 'Found ongoing interaction')

  ctx.interaction = interaction
  return next()
}

import { FastifyLoggerInstance } from 'fastify'

import { DataStorageClient } from '../clients/dataStorage'
import { MiddlewareBuilder } from '../models/Buildes'
import { DecoratedContext } from '../models/DecoratedContext'
import { BaseInteractionKeys, Interaction } from '../models/Interaction'
import { ProcessError } from '../utils/Errors'

export const buildRetrieveInteractionMiddleware: MiddlewareBuilder = ({ configuration, log: logger, dataStorageClient }) => {
  const { flow: { steps } } = configuration

  return async (ctx, next) => {
    const { chatId } = ctx
    logger.trace({ chatId }, "Executing middleware 'retrieveInteraction'")

    const interaction = await getInteractionFromStorageClient(logger, dataStorageClient, ctx)
    ctx.interaction = interaction

    const { [BaseInteractionKeys.CURRENT_STEP_ID]: currStepId } = interaction
    const currStep = steps[currStepId]

    if (!currStep) {
      logger.error({ currStepId, chatId }, 'Current step not found')
      throw new ProcessError('Current step not found', ctx.t('errors.unknownStep'))
    }

    ctx.currStep = currStep
    ctx.nextStep = steps[currStep.nextStepId as string]
    ctx.isInteractionCompleted = !currStep.nextStepId

    return next()
  }
}

const getInteractionFromStorageClient = async (
  logger: FastifyLoggerInstance,
  storageClient: DataStorageClient,
  ctx: DecoratedContext
): Promise<Interaction> => {
  const { chatId } = ctx

  let interactions: Interaction[]

  try {
    interactions = await storageClient.getOngoingInteractions(chatId)
  } catch (error: any) {
    logger.error({ error, chatId }, 'Error retrieving ongoing interaction')
    throw new ProcessError('Error retrieving ongoing interaction', ctx.t('errors.retrieveInteraction'))
  }

  const interactionsCount = interactions.length

  if (interactionsCount === 0) {
    logger.error({ chatId }, 'No ongoing interactions found')
    throw new ProcessError('No ongoing interaction found', ctx.t('errors.noInteractionsFound'))
  }

  if (interactionsCount > 1) {
    logger.error({ chatId, interactionsCount }, 'Too many ongoing interactions found')
    throw new ProcessError('Too many ongoing interactions found', ctx.t('errors.tooManyInteractionsFound'))
  }

  const [interaction] = interactions
  logger.trace({ chatId, interaction }, 'Found ongoing interaction')

  return interaction
}

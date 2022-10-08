import { FastifyInstance } from 'fastify'

import { DecoratedContext } from '../models/DecoratedContext'
import { BaseInteractionKeys, Interaction, InteractionState } from '../models/Interaction'
import { FlowStep } from '../schemas/config'
import { ProcessError } from '../utils/Errors'

export const updateInteraction = async (
  { dataStorageClient, log: logger }: FastifyInstance,
  ctx: DecoratedContext<any>,
  stepValue: any
) => {
  const { chatId, currStep, nextStep, interaction } = ctx
  const { id: interactionId } = interaction
  const { persistAs } = currStep
  const { id: nextStepId } = (nextStep || {}) as FlowStep

  const patchBody: Partial<Interaction> = {
    [persistAs!]: stepValue,
    ...(nextStepId && { [BaseInteractionKeys.CURRENT_STEP_ID]: nextStepId }),
    ...(!nextStepId && { [BaseInteractionKeys.INTERACTION_STATE]: InteractionState.COMPLETED }),
  }

  try {
    await dataStorageClient.updateInteraction(interactionId, patchBody)
  } catch (error) {
    logger.error({ error, chatId, patchBody }, 'Error updating interaction')
    throw new ProcessError('Error updating interaction', ctx.t('errors.updateInteraction'))
  }
}

import {FastifyInstance} from 'fastify'
import {Update} from 'telegraf/typings/core/types/typegram'

import {DecoratedContext} from '../models/DecoratedContext'
import {Step} from '../models/Flow'
import {BaseInteractionKeys, Interaction, InteractionState} from '../models/Interaction'
import {ProcessError} from '../utils/Errors'

export const updateInteraction = async (
  {storageClient, log: logger}: FastifyInstance,
  ctx: DecoratedContext<Update.MessageUpdate>,
  stepValue: any
) => {
  const {chatId, currStep, nextStep, interaction} = ctx
  const {id: interactionId} = interaction
  const {persistAs} = currStep
  const {id: nextStepId} = (nextStep || {}) as Step

  const patchBody: Partial<Interaction> = {
    [persistAs]: stepValue,
    ...(nextStepId && {[BaseInteractionKeys.CURRENT_STEP_ID]: nextStepId}),
    ...(!nextStepId && {[BaseInteractionKeys.INTERACTION_STATE]: InteractionState.COMPLETED}),
  }

  try {
    await storageClient.updateInteraction(interactionId, patchBody)
  } catch (error) {
    logger.error({error, chatId, patchBody}, 'Error updating interaction')
    throw new ProcessError('Error updating interaction', ctx.t('errors.updateInteraction'))
  }
}

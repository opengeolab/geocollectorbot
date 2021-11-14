import {Message, Update} from 'telegraf/typings/core/types/typegram'

import {composeReply} from '../lib/replyComposer'
import {HandlerBuilder} from '../models/Buildes'
import {Step, StepType} from '../models/Flow'
import {BaseInteractionKeys, Interaction, InteractionState} from '../models/Interaction'
import {ProcessError} from '../utils/Errors'

export const buildTextHandler: HandlerBuilder<Update.MessageUpdate> = ({storageClient, log: logger}) => {
  const acceptedStepType = StepType.TEXT

  return async ctx => {
    const {chatId, message, interaction, currStep, nextStep} = ctx
    const {id: interactionId} = interaction
    const {type, persistAs} = currStep
    const {id: nextStepId} = (nextStep || {}) as Step
    const {text} = message as Message.TextMessage

    logger.trace({chatId, message}, 'Handling text message')

    // TODO handle the "wrong type" case
    if (type !== acceptedStepType) {
      logger.error({currStep, chatId}, 'Wrong current step type')
      throw new ProcessError('Wrong current step type', ctx.t('errors.wrongStepType'))
    }

    const patchBody: Partial<Interaction> = {
      [persistAs]: text,
      ...(nextStepId && {[BaseInteractionKeys.CURRENT_STEP_ID]: nextStepId}),
      ...(!nextStepId && {[BaseInteractionKeys.INTERACTION_STATE]: InteractionState.COMPLETED}),
    }

    try {
      await storageClient.updateInteraction(interactionId, patchBody)
    } catch (error) {
      logger.error({error, chatId, patchBody}, 'Error updating interaction')
      throw new ProcessError('Error updating interaction', ctx.t('errors.updateInteraction'))
    }

    const replyArgs = composeReply(logger, ctx)
    await ctx.reply(...replyArgs)
  }
}

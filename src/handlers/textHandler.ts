import {Message, Update} from 'telegraf/typings/core/types/typegram'

import {HandlerBuilder} from '../models/Buildes'
import {StepType} from '../models/Flow'
import {BaseInteractionKeys, Interaction, InteractionState} from '../models/Interaction'
import {ProcessError} from '../utils/Errors'
import {resolveLocalizedText} from '../utils/localizer'

export const buildTextHandler: HandlerBuilder<Update.MessageUpdate> = ({configuration, storageClient, log: logger}) => {
  const {flow: {steps}} = configuration
  const acceptedStepType = StepType.TEXT

  return async ctx => {
    const {chatId, message, interaction, from: user} = ctx
    const {text} = message as Message.TextMessage

    logger.trace({chatId, message}, 'Handling text message')

    const {id: interactionId, currStepId} = interaction
    const currStep = steps[currStepId]

    if (!currStep) {
      logger.error({currStepId, chatId}, 'Current step not found')
      throw new ProcessError('Current step not found', ctx.t('errors.unknownStep'))
    }

    const {type, persistAs, nextStepId} = currStep

    // TODO handle the "wrong type" case
    if (type !== acceptedStepType) {
      logger.error({currStep, chatId}, 'Wrong current step type')
      throw new ProcessError('Wrong current step type', ctx.t('errors.wrongStepType'))
    }

    const isInteractionCompleted = !nextStepId

    const patchBody: Partial<Interaction> = {
      [persistAs]: text,
      ...(!isInteractionCompleted && {[BaseInteractionKeys.CURRENT_STEP_ID]: nextStepId}),
      ...(isInteractionCompleted && {[BaseInteractionKeys.INTERACTION_STATE]: InteractionState.COMPLETED}),
    }

    try {
      await storageClient.updateInteraction(interactionId, patchBody)
    } catch (error) {
      logger.error({error, chatId, patchBody}, 'Error updating interaction')
      throw new ProcessError('Error updating interaction', ctx.t('errors.updateInteraction'))
    }

    const {question: nextQuestion} = steps[nextStepId as string] || {}
    const reply = isInteractionCompleted ? ctx.t('events.interactionCompleted') : resolveLocalizedText(nextQuestion, user?.language_code)

    await ctx.reply(reply)
  }
}

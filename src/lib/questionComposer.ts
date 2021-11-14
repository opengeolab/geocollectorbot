import {FastifyLoggerInstance} from 'fastify'

import {DecoratedContext} from '../models/DecoratedContext'
import {Step} from '../models/Flow'
import {resolveLocalizedText} from '../utils/localizer'

export const composeQuestion = (logger: FastifyLoggerInstance, ctx: DecoratedContext<any>): string => {
  const {chatId, nextStep, from: user} = ctx
  logger.trace({chatId}, 'Composing question')

  const isInteractionCompleted = !nextStep
  const {question: nextQuestion} = nextStep as Step || {}

  return isInteractionCompleted ? ctx.t('events.interactionCompleted') : resolveLocalizedText(nextQuestion, user?.language_code)
}

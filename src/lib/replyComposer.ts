import {FastifyLoggerInstance} from 'fastify'
import {Context} from 'telegraf'

import {DecoratedContext} from '../models/DecoratedContext'
import {Step, StepType} from '../models/Flow'

import {stepTypeToComposer} from './questionComposer'

export type ReplyArgs = Parameters<Context['reply']>

const composeInteractionCompletedReply = (ctx: DecoratedContext): ReplyArgs => {
  const text = ctx.t('events.interactionCompleted')
  return [text]
}

export const composeReply = (logger: FastifyLoggerInstance, ctx: DecoratedContext<any>): ReplyArgs => {
  const {chatId, nextStep} = ctx
  const {type} = nextStep || {} as Step
  logger.trace({chatId, nextStep}, 'Composing question')

  const isInteractionCompleted = !nextStep
  const questionComposer = stepTypeToComposer[type] || stepTypeToComposer[StepType.TEXT]

  return isInteractionCompleted ? composeInteractionCompletedReply(ctx) : questionComposer({ctx, step: nextStep as Step})
}

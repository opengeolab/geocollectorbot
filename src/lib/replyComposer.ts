import {FastifyLoggerInstance} from 'fastify'
import {Context} from 'telegraf'
import {ExtraReplyMessage} from 'telegraf/typings/telegram-types'

import {DecoratedContext} from '../models/DecoratedContext'
import {Step, StepType} from '../models/Flow'

import {stepTypeToComposer} from './questionComposer'

export type ReplyArgs = Parameters<Context['reply']>

const composeInteractionCompletedReply = (ctx: DecoratedContext): ReplyArgs => {
  const text = ctx.t('events.interactionCompleted')
  const extra: ExtraReplyMessage = {
    reply_markup: {remove_keyboard: true},
  }

  return [text, extra]
}

export const composeReply = (logger: FastifyLoggerInstance, ctx: DecoratedContext<any>): ReplyArgs => {
  const {chatId, nextStep} = ctx
  const {config} = nextStep || {} as Step
  logger.trace({chatId, nextStep}, 'Composing question')

  const isInteractionCompleted = !nextStep
  const questionComposer = stepTypeToComposer[config?.type] || stepTypeToComposer[StepType.TEXT]

  return isInteractionCompleted ? composeInteractionCompletedReply(ctx) : questionComposer({ctx, step: nextStep as Step})
}

export const composeErrorReply = (text: string): ReplyArgs => [text, {reply_markup: {remove_keyboard: true}}]

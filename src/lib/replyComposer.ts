import { FastifyLoggerInstance } from 'fastify'
import { Context } from 'telegraf'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

import { DecoratedContext } from '../models/DecoratedContext'
import { StepType } from '../models/Flow'
import { FlowStep } from '../schemas/config'

import { getQuestionComposerByType } from './questionComposer'

export type ReplyArgs = Parameters<Context['reply']>

export const composeLocalizedReply = (ctx: DecoratedContext<any>, messageKey: string): ReplyArgs => {
  const text = ctx.t(messageKey)
  const extra: ExtraReplyMessage = { reply_markup: { remove_keyboard: true }, parse_mode: 'MarkdownV2' }

  return [text, extra]
}

export const composeReply = (logger: FastifyLoggerInstance, ctx: DecoratedContext<any>): ReplyArgs => {
  const { chatId, nextStep } = ctx
  const { config } = nextStep || {} as FlowStep
  logger.trace({ chatId, nextStep }, 'Composing question')

  const isInteractionCompleted = !nextStep
  const questionComposer = getQuestionComposerByType(config?.type as StepType)

  return isInteractionCompleted ?
    composeLocalizedReply(ctx, 'events.interactionCompleted') :
    questionComposer({ ctx, step: nextStep as FlowStep })
}

export const composeErrorReply = (text: string): ReplyArgs => [text, { reply_markup: { remove_keyboard: true }, parse_mode: 'MarkdownV2' }]

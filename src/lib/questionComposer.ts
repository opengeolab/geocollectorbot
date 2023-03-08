import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

import { DecoratedContext } from '../models/DecoratedContext'
import { StepType } from '../models/Flow'
import { FlowStep, LocalizedText, MultipleChoiceFlowStepConfig } from '../schemas/config'
import { resolveLocalizedText } from '../utils/localizer'
import { buildCallbackData } from '../utils/multipleChoiceParser'

import { ReplyArgs } from './replyComposer'

export type QuestionComposerProps = {
  ctx: DecoratedContext
  step: FlowStep
}

export type QuestionComposer = (props: QuestionComposerProps) => ReplyArgs

const localizeText = ({ from: user }: DecoratedContext, { question }: FlowStep): string => resolveLocalizedText(question, user?.language_code)

const composeTextQuestion: QuestionComposer = ({ ctx, step }) => {
  const text = localizeText(ctx, step)
  const extra: ExtraReplyMessage = { reply_markup: { remove_keyboard: true }, parse_mode: 'MarkdownV2' }

  return [text, extra]
}

const composeMultipleChoiceQuestion: QuestionComposer = ({ ctx, step }) => {
  const { from: user } = ctx
  const { id: stepId, config } = step
  const { options } = config as MultipleChoiceFlowStepConfig

  const text = localizeText(ctx, step)

  const keyboardButtons: InlineKeyboardButton[][] = options
    .map(optionsRow => optionsRow
      .map(({ text: optionText, value }) => ({
        text: resolveLocalizedText(optionText as LocalizedText, user?.language_code),
        callback_data: buildCallbackData(stepId, value),
      }))
    )

  const extra: ExtraReplyMessage = {
    reply_markup: {
      remove_keyboard: true,
      inline_keyboard: keyboardButtons,
    },
    parse_mode: 'MarkdownV2',
  }

  return [text, extra]
}

const composeLocationQuestion: QuestionComposer = ({ ctx, step }) => {
  const text = localizeText(ctx, step)

  const extra: ExtraReplyMessage = {
    reply_markup: {
      remove_keyboard: true,
      one_time_keyboard: true,
      keyboard: [[{ text: ctx.t('keyboards.location'), request_location: true }]],
    },
    parse_mode: 'MarkdownV2',
  }

  return [text, extra]
}

const composeMediaQuestion: QuestionComposer = ({ ctx, step }) => {
  const text = localizeText(ctx, step)
  const extra: ExtraReplyMessage = { reply_markup: { remove_keyboard: true }, parse_mode: 'MarkdownV2' }

  return [text, extra]
}

const stepTypeToComposer: Record<StepType, QuestionComposer> = {
  [StepType.TEXT]: composeTextQuestion,
  [StepType.MULTIPLE_CHOICE]: composeMultipleChoiceQuestion,
  [StepType.LOCATION]: composeLocationQuestion,
  [StepType.SINGLE_MEDIA]: composeMediaQuestion,
  [StepType.MULTIPLE_MEDIA]: composeMediaQuestion,
}

export const getQuestionComposerByType = (type?: StepType) => stepTypeToComposer[type || StepType.TEXT] || stepTypeToComposer[StepType.TEXT]

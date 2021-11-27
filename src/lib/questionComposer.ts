import {ExtraReplyMessage} from 'telegraf/typings/telegram-types'
import {InlineKeyboardButton} from 'typegram/inline'

import {DecoratedContext} from '../models/DecoratedContext'
import {Step, StepType} from '../models/Flow'
import {MultipleChoiceStepConfig} from '../schemas/configuration/flow/stepConfig'
import {LocalizedText} from '../schemas/localizedText'
import {resolveLocalizedText} from '../utils/localizer'
import {buildCallbackData} from '../utils/multipleChoiceParser'

import {ReplyArgs} from './replyComposer'

export type QuestionComposerProps = {
  ctx: DecoratedContext
  step: Step
}

export type QuestionComposer = (props: QuestionComposerProps) => ReplyArgs

const localizeText = ({from: user}: DecoratedContext, {question}: Step): string => resolveLocalizedText(question, user?.language_code)

const composeTextQuestion: QuestionComposer = ({ctx, step}) => {
  const text = localizeText(ctx, step)
  const extra: ExtraReplyMessage = {reply_markup: {remove_keyboard: true}}

  return [text, extra]
}

const composeMultipleChoiceQuestion: QuestionComposer = ({ctx, step}) => {
  const {from: user} = ctx
  const {id: stepId, config} = step
  const {options} = config as MultipleChoiceStepConfig

  const text = localizeText(ctx, step)

  const keyboardButtons: InlineKeyboardButton[][] = options
    .map(optionsRow => optionsRow
      .map(({text: optionText, value}) => ({
        text: resolveLocalizedText(optionText as LocalizedText, user?.language_code),
        callback_data: buildCallbackData(stepId, value),
      }))
    )

  const extra: ExtraReplyMessage = {
    reply_markup: {
      remove_keyboard: true,
      inline_keyboard: keyboardButtons,
    },
  }

  return [text, extra]
}

const composeLocationQuestion: QuestionComposer = ({ctx, step}) => {
  const text = localizeText(ctx, step)

  const extra: ExtraReplyMessage = {
    reply_markup: {
      remove_keyboard: true,
      one_time_keyboard: true,
      keyboard: [
        [{text: ctx.t('keyboards.location'), request_location: true}],
      ],
    },
  }

  return [text, extra]
}

const composeMediaQuestion: QuestionComposer = ({ctx, step}) => {
  const text = localizeText(ctx, step)
  const extra: ExtraReplyMessage = {reply_markup: {remove_keyboard: true}}

  return [text, extra]
}

export const stepTypeToComposer: Record<StepType, QuestionComposer> = {
  [StepType.TEXT]: composeTextQuestion,
  [StepType.MULTIPLE_CHOICE]: composeMultipleChoiceQuestion,
  [StepType.LOCATION]: composeLocationQuestion,
  [StepType.MEDIA]: composeMediaQuestion,
}

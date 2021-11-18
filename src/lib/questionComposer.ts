import {ExtraReplyMessage} from 'telegraf/typings/telegram-types'

import {DecoratedContext} from '../models/DecoratedContext'
import {Step, StepType} from '../models/Flow'
import {resolveLocalizedText} from '../utils/localizer'

import {ReplyArgs} from './replyComposer'

export type QuestionComposerProps = {
  ctx: DecoratedContext
  step: Step
}

export type QuestionComposer = (props: QuestionComposerProps) => ReplyArgs

const localizeText = ({from: user}: DecoratedContext, {question}: Step): string => resolveLocalizedText(question, user?.language_code)

const composeTextQuestion: QuestionComposer = ({ctx, step}) => {
  const text = localizeText(ctx, step)

  const extra: ExtraReplyMessage = {
    reply_markup: {remove_keyboard: true},
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

export const stepTypeToComposer: Record<StepType, QuestionComposer> = {
  [StepType.TEXT]: composeTextQuestion,
  [StepType.LOCATION]: composeLocationQuestion,
}

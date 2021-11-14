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

const composeTextQuestion: QuestionComposer = ({ctx, step}) => {
  const {from: user} = ctx
  const {question} = step

  const text = resolveLocalizedText(question, user?.language_code)
  return [text]
}

const composeLocationQuestion: QuestionComposer = () => {
  const text = 'Location request'

  const extra: ExtraReplyMessage = {
    reply_markup: {
      keyboard: [
        [{text: 'Access my location', request_location: true}],
      ],
    },
  }

  return [text, extra]
}

export const stepTypeToComposer: Record<StepType, QuestionComposer> = {
  [StepType.TEXT]: composeTextQuestion,
  [StepType.LOCATION]: composeLocationQuestion,
}

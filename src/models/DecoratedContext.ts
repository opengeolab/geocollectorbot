import { TFunction } from 'i18next'
import { Context } from 'telegraf'
import { Deunionize } from 'telegraf/src/deunionize'
import { Update } from 'telegraf/typings/core/types/typegram'

import { Step } from './Flow'
import { Interaction } from './Interaction'

export interface DecoratedContext<U extends Deunionize<Update> = Update> extends Context<U> {
  chatId: number
  lang: string
  t: TFunction
  interaction: Interaction
  currStep: Step
  nextStep?: Step
}

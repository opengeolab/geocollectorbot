import {Context} from 'telegraf'
import {Deunionize} from 'telegraf/src/deunionize'
import {Update} from 'telegraf/typings/core/types/typegram'

import {Interaction} from './Interaction'

export interface DecoratedContext<U extends Deunionize<Update> = Update> extends Context<U> {
  chatId: number
  lang: string
  interaction: Interaction
}

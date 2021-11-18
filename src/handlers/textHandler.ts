import {Message, Update} from 'telegraf/typings/core/types/typegram'

import {handleIncomingMessage, StepValueBuilder} from '../lib/messageHandler'
import {HandlerBuilder} from '../models/Buildes'
import {StepType} from '../models/Flow'

export const buildTextHandler: HandlerBuilder<Update.MessageUpdate> = service => {
  const acceptedStepType = StepType.TEXT
  const stepValueBuilder: StepValueBuilder<Message.TextMessage> = async ({message}) => message.text

  return async ctx => handleIncomingMessage(service, ctx, acceptedStepType, stepValueBuilder)
}

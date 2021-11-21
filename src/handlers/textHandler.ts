import {Message, Update} from 'telegraf/typings/core/types/typegram'

import {handleIncomingMessage, StepValidator, StepValueBuilder} from '../lib/messageHandler'
import {HandlerBuilder} from '../models/Buildes'
import {StepType} from '../models/Flow'
import {ProcessError} from '../utils/Errors'

export const buildTextHandler: HandlerBuilder<Update.MessageUpdate> = service => {
  const stepValidator: StepValidator<Message.TextMessage> = ({ctx, service: {log: logger}, currStep}) => {
    if (currStep.config.type !== StepType.TEXT) {
      logger.error({currStep, acceptedType: StepType.TEXT}, 'Wrong current step type')
      throw new ProcessError('Wrong current step type', ctx.t('errors.wrongStepType'))
    }
  }

  const stepValueBuilder: StepValueBuilder<Message.TextMessage> = async ({message}) => message.text

  return async ctx => handleIncomingMessage(service, ctx, stepValidator, stepValueBuilder)
}

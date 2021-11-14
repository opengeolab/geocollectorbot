import {Update} from 'telegraf/typings/core/types/typegram'

import {composeReply} from '../lib/replyComposer'
import {HandlerBuilder} from '../models/Buildes'
import {StepType} from '../models/Flow'
import {ProcessError} from '../utils/Errors'

export const buildLocationHandler: HandlerBuilder<Update.MessageUpdate> = ({log: logger}) => {
  const acceptedStepType = StepType.LOCATION

  return async ctx => {
    const {chatId, message, currStep} = ctx
    const {type} = currStep
    // const {location} = message as Message.LocationMessage

    logger.trace({chatId, message}, 'Handling location message')

    // TODO handle the "wrong type" case
    if (type !== acceptedStepType) {
      logger.error({currStep, chatId}, 'Wrong current step type')
      throw new ProcessError('Wrong current step type', ctx.t('errors.wrongStepType'))
    }

    const replyArgs = composeReply(logger, ctx)
    await ctx.reply(...replyArgs)
  }
}

import {Message, Update} from 'telegraf/typings/core/types/typegram'

import {handleIncomingMessage, StepValidator, StepValueBuilder} from '../lib/messageHandler'
import {HandlerBuilder} from '../models/Buildes'
import {StepType} from '../models/Flow'
import {ProcessError} from '../utils/Errors'

export const buildLocationHandler: HandlerBuilder<Update.MessageUpdate> = service => {
  const stepValidator: StepValidator<Message.LocationMessage> = ({ctx, service: {log: logger}, currStep}) => {
    if (currStep.config.type !== StepType.LOCATION) {
      logger.error({currStep, acceptedType: StepType.LOCATION}, 'Wrong current step type')
      throw new ProcessError('Wrong current step type', ctx.t('errors.wrongStepType'))
    }
  }

  const stepValueBuilder: StepValueBuilder<Message.LocationMessage> = async ({service: {dataStorageClient}, message}) => {
    const {location: {latitude, longitude}} = message
    return dataStorageClient.createSpatialPayload(latitude, longitude)
  }

  return async ctx => handleIncomingMessage(service, ctx, stepValidator, stepValueBuilder)
}

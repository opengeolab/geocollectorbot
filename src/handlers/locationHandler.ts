import {Message, Update} from 'telegraf/typings/core/types/typegram'

import {handleIncomingMessage, StepValueBuilder} from '../lib/messageHandler'
import {HandlerBuilder} from '../models/Buildes'
import {StepType} from '../models/Flow'

export const buildLocationHandler: HandlerBuilder<Update.MessageUpdate> = service => {
  const acceptedStepType = StepType.LOCATION

  const stepValueBuilder: StepValueBuilder<Message.LocationMessage> = async ({service: {dataStorageClient}, message}) => {
    const {location: {latitude, longitude}} = message
    return dataStorageClient.createSpatialPayload(latitude, longitude)
  }

  return async ctx => handleIncomingMessage(service, ctx, acceptedStepType, stepValueBuilder)
}

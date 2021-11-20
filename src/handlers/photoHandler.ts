import {Message, Update} from 'telegraf/typings/core/types/typegram'

import {handleIncomingMessage, StepValueBuilder} from '../lib/messageHandler'
import {HandlerBuilder} from '../models/Buildes'
import {StepType} from '../models/Flow'

export const buildPhotoHandler: HandlerBuilder<Update.MessageUpdate> = service => {
  const acceptedStepType = StepType.PHOTO

  const stepValueBuilder: StepValueBuilder<Message.PhotoMessage> = async () => {
    // const {photo: photos} = message
    // const [photo] = photos
    // const {file_id: fileId} = photo
    //
    // const photoLink = await ctx.telegram.getFile(fileId)

    return ''
  }

  return async ctx => handleIncomingMessage(service, ctx, acceptedStepType, stepValueBuilder)
}

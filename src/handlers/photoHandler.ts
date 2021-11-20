import path from 'path'
import {Readable} from 'stream'

import axios from 'axios'
import {Message, Update} from 'telegraf/typings/core/types/typegram'

import {handleIncomingMessage, StepValueBuilder} from '../lib/messageHandler'
import {HandlerBuilder} from '../models/Buildes'
import {StepType} from '../models/Flow'
import {ProcessError} from '../utils/Errors'

export const buildPhotoHandler: HandlerBuilder<Update.MessageUpdate> = service => {
  const {mediaStorageClient} = service
  const acceptedStepType = StepType.PHOTO

  const stepValueBuilder: StepValueBuilder<Message.PhotoMessage> = async ({service: {log: logger}, ctx, message}) => {
    const {photo: photos} = message
    // TODO chose correct size
    const photo = photos[photos.length - 1]
    const {file_id: fileId} = photo

    try {
      const {file_path: filePath} = await ctx.telegram.getFile(fileId)
      const fileExtension = path.extname(filePath || '.txt')
      const {href: photoLink} = await ctx.telegram.getFileLink(fileId)

      const getFileResponse = await axios.get<Readable>(photoLink, {responseType: 'stream'})
      const fileStream = getFileResponse.data

      return await mediaStorageClient!.saveMedia(fileStream, `${fileId}${fileExtension}`)
    } catch (err: any) {
      logger.error({err, fileId}, 'Error saving media')
      throw new ProcessError('Error saving media', ctx.t('errors.mediaSaving'))
    }
  }

  return async ctx => handleIncomingMessage(service, ctx, acceptedStepType, stepValueBuilder)
}

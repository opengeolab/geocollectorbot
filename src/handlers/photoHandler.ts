import path from 'path'
import { Readable } from 'stream'

import axios from 'axios'
import { Message, Update } from 'telegraf/typings/core/types/typegram'

import { handleIncomingMessage, StepValidator, StepValueBuilder } from '../lib/messageHandler'
import { HandlerBuilder } from '../models/Buildes'
import { MediaStepSubtype, StepType } from '../models/Flow'
import { MediaFlowStepConfig } from '../schemas/config'
import { ProcessError } from '../utils/Errors'

export const buildPhotoHandler: HandlerBuilder<Update.MessageUpdate> = service => {
  const { mediaStorageClient } = service

  const stepValidator: StepValidator<Message.PhotoMessage> = ({ ctx, service: { log: logger }, currStep }) => {
    const { config } = currStep
    const { type, subType } = config as MediaFlowStepConfig

    if (!(type === StepType.MEDIA && subType === MediaStepSubtype.PHOTO)) {
      logger.error({ currStep, acceptedType: StepType.MEDIA, acceptedSubType: MediaStepSubtype.PHOTO }, 'Wrong current step type')
      throw new ProcessError('Wrong current step type', ctx.t('errors.wrongStepType'))
    }
  }

  const stepValueBuilder: StepValueBuilder<Message.PhotoMessage> = async ({ service: { log: logger }, ctx, message }) => {
    const { photo: photos } = message
    const photo = photos[photos.length - 1]
    const { file_id: fileId } = photo

    try {
      const { file_path: filePath } = await ctx.telegram.getFile(fileId)
      if (!filePath) { throw new Error('Cannot get file path') }

      const fileExtension = path.extname(filePath)

      const { href: photoLink } = await ctx.telegram.getFileLink(fileId)

      const getFileResponse = await axios.get<Readable>(photoLink, { responseType: 'stream' })
      const fileStream = getFileResponse.data

      return await mediaStorageClient!.saveMedia(fileStream, `${fileId}${fileExtension}`)
    } catch (err: any) {
      logger.error({ err, fileId }, 'Error saving media')
      throw new ProcessError('Error saving media', ctx.t('errors.savingMedia'))
    }
  }

  return async ctx => handleIncomingMessage(service, ctx, stepValidator, stepValueBuilder)
}

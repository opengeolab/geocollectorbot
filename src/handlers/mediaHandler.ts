import path from 'path'
import { Readable } from 'stream'

import axios from 'axios'
import { Message, Update } from 'telegraf/typings/core/types/typegram'

import { handleIncomingMessage, StepValidator, StepValueBuilder } from '../lib/messageHandler'
import { HandlerBuilder } from '../models/Buildes'
import { MediaStepSubtype, StepType } from '../models/Flow'
import { SingleMediaFlowStepConfig } from '../schemas/config'
import { ProcessError } from '../utils/Errors'

const extractPhotoFileId = (message: Message.PhotoMessage): string => {
  const { photo: photos } = message

  const photo = photos[photos.length - 1]
  return photo.file_id
}

const extractVideoLink = (message: Message.VideoMessage): string => message.video.file_id

export const buildMediaHandler: HandlerBuilder<Update.MessageUpdate, { mediaType: MediaStepSubtype }> = (service, options) => {
  const { mediaStorageClient } = service
  const { mediaType } = options ?? {}

  const stepValidator: StepValidator<Message.PhotoMessage> = ({ ctx, service: { log: logger }, currStep }) => {
    const { config } = currStep
    const { type, acceptOnly } = config as SingleMediaFlowStepConfig

    if (!(type === StepType.SINGLE_MEDIA)) {
      logger.error({ currStep, acceptedType: StepType.SINGLE_MEDIA }, 'Wrong current step type')
      throw new ProcessError('Wrong current step type', ctx.t('errors.wrongStepType'))
    }

    if (acceptOnly && acceptOnly !== mediaType) {
      logger.error({ currStep, acceptedMediaType: acceptOnly }, 'Wrong media type')
      throw new ProcessError('Wrong current step type', ctx.t('errors.wrongMediaType', { acceptedMediaType: acceptOnly }))
    }
  }

  const stepValueBuilder: StepValueBuilder<Message.PhotoMessage | Message.VideoMessage> = async ({ service: { log: logger }, ctx, message }) => {
    const fileId = mediaType === MediaStepSubtype.PHOTO ?
      extractPhotoFileId(message as Message.PhotoMessage) :
      extractVideoLink(message as Message.VideoMessage)

    try {
      const { file_path: filePath } = await ctx.telegram.getFile(fileId)
      if (!filePath) { throw new Error('Cannot get file path') }

      const fileExtension = path.extname(filePath)

      const { href: photoLink } = await ctx.telegram.getFileLink(fileId)

      const getFileResponse = await axios.get<Readable>(photoLink, { responseType: 'stream' })
      const fileStream = getFileResponse.data

      const savedFilePath = await mediaStorageClient!.saveMedia(fileStream, `${fileId}${fileExtension}`)
      return [savedFilePath]
    } catch (err: any) {
      logger.error({ err, fileId }, 'Error saving media')
      throw new ProcessError('Error saving media', ctx.t('errors.savingMedia'))
    }
  }

  return async ctx => handleIncomingMessage(service, ctx, stepValidator, stepValueBuilder)
}

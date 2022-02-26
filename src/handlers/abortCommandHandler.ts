import { Update } from 'telegraf/typings/core/types/typegram'

import { composeLocalizedReply } from '../lib/replyComposer'
import { HandlerBuilder } from '../models/Buildes'
import { ProcessError } from '../utils/Errors'

export const buildAbortCommandHandler: HandlerBuilder<Update.MessageUpdate> = service => {
  const { dataStorageClient, log: logger } = service

  return async ctx => {
    const { chatId, interaction } = ctx
    const { id: interactionId } = interaction
    logger.trace({ chatId }, "Executing command '/abort'")

    try {
      await dataStorageClient.abortInteraction(interactionId)
    } catch (error) {
      logger.error({ error, chatId }, 'Error aborting interaction')
      throw new ProcessError('Error aborting interaction', ctx.t('errors.abortInteraction'))
    }

    const replyArgs = composeLocalizedReply(ctx, 'events.interactionAborted')
    await ctx.reply(...replyArgs)
  }
}

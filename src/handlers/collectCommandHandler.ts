import { Update } from 'telegraf/typings/core/types/typegram'

import { composeReply } from '../lib/replyComposer'
import { HandlerBuilder } from '../models/Buildes'
import { Interaction } from '../models/Interaction'
import { ProcessError } from '../utils/Errors'

export const buildCollectCommandHandler: HandlerBuilder<Update.MessageUpdate> = service => {
  const { dataStorageClient, configuration, log: logger } = service
  const { flow: { firstStepId, steps } } = configuration

  return async ctx => {
    const { chatId, from } = ctx
    const { username } = from || {}
    logger.trace({ chatId, username }, "Executing command '/collect'")

    let ongoingInteractions: Interaction[]
    try {
      ongoingInteractions = await dataStorageClient.getOngoingInteractions(chatId)
    } catch (error: any) {
      logger.error({ error, chatId }, 'Error retrieving ongoing interaction')
      throw new ProcessError('Error retrieving ongoing interaction', ctx.t('errors.createInteraction'))
    }

    if (ongoingInteractions.length > 0) {
      logger.error({ chatId }, 'An ongoing interaction already exists')
      throw new ProcessError('An ongoing interaction already exists', ctx.t('errors.ongoingInteractionAlreadyExists'))
    }

    try {
      await dataStorageClient.createInteraction(chatId as number, username, firstStepId)
    } catch (error) {
      logger.error({ error, chatId }, 'Error creating new interaction')
      throw new ProcessError('Error creating new interaction', ctx.t('errors.createInteraction'))
    }

    ctx.nextStep = steps[firstStepId]
    const replyArgs = composeReply(logger, ctx)
    await ctx.reply(...replyArgs)
  }
}

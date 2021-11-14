import {Update} from 'telegraf/typings/core/types/typegram'

import {composeQuestion} from '../lib/questionComposer'
import {HandlerBuilder} from '../models/Buildes'
import {ProcessError} from '../utils/Errors'

export const buildCollectCommandHandler: HandlerBuilder<Update.MessageUpdate> = service => {
  const {storageClient, configuration, log: logger} = service
  const {flow: {firstStepId, steps}} = configuration

  return async ctx => {
    const {chatId} = ctx
    logger.trace({chatId}, 'Executing command "/collect"')

    // TODO check if there is already an ongoing interaction

    try {
      await storageClient.createInteraction(chatId as number, firstStepId)
    } catch (error) {
      logger.error({error, chatId}, 'Error creating new interaction')
      throw new ProcessError('Error creating new interaction', ctx.t('errors.createInteraction'))
    }

    ctx.nextStep = steps[firstStepId]
    const question = composeQuestion(logger, ctx)
    await ctx.reply(question)
  }
}

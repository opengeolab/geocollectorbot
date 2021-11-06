import {Update} from 'telegraf/typings/core/types/typegram'

import {HandlerBuilder} from '../models/Buildes'
import {ProcessError} from '../utils/Errors'
import {resolveLocalizedText} from '../utils/localizer'

export const buildCollectCommandHandler: HandlerBuilder<Update.MessageUpdate> = service => {
  const {storageClient, configuration, log: logger} = service
  const {flow: {firstStepId, steps}} = configuration

  return async ctx => {
    const {chatId, from: user} = ctx
    logger.trace({chatId}, 'Executing command "/collect"')

    // TODO check if there is already an ongoing interaction

    try {
      await storageClient.createInteraction(chatId as number, firstStepId)
    } catch (error) {
      logger.error({error, chatId}, 'Error creating new interaction')
      throw new ProcessError('Error creating new interaction', ctx.t('errors.createInteraction'))
    }

    const {question} = steps[firstStepId]
    const localizedQuestion = resolveLocalizedText(question, user?.language_code)

    await ctx.reply(localizedQuestion)
  }
}

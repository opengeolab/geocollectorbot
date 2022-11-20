import { Update } from 'telegraf/typings/core/types/typegram'

import { handleIncomingMessage } from '../lib/messageHandler'
import { HandlerBuilder } from '../models/Buildes'
import { ProcessError } from '../utils/Errors'

export const buildSkipCommandHandler: HandlerBuilder<Update.MessageUpdate> = service => {
  const { log: logger } = service

  return async ctx => {
    const { chatId, currStep } = ctx
    logger.trace({ chatId }, "Executing command '/skip'")

    if (!currStep.skippable) {
      logger.error({ currStep }, 'Step cannot be skipped')
      throw new ProcessError('Step cannot be skipped', ctx.t('errors.stepCannotBeSkipped'))
    }

    await handleIncomingMessage(
      service,
      ctx,
      () => true,
      () => Promise.resolve()
    )
  }
}

import {Update} from 'telegraf/typings/core/types/typegram'

import {HandlerBuilder} from '../models/Buildes'

export const buildHelpCommandHandler: HandlerBuilder<Update.MessageUpdate> = ({log: logger}) => async ctx => {
  logger.trace({chatId: ctx.chat?.id}, 'Executing command "/help"')

  await ctx.reply(ctx.t('commands.help.content'))
}

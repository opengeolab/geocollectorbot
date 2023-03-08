import { Update } from 'telegraf/typings/core/types/typegram'

import { HandlerBuilder } from '../models/Buildes'

export const buildHelpCommandHandler: HandlerBuilder<Update.MessageUpdate> = ({ log: logger }) => async ctx => {
  /* istanbul ignore next */
  logger.trace({ chatId: ctx.chat?.id }, "Executing command '/help'")

  await ctx.reply(ctx.t('commands.help') as string, { parse_mode: 'MarkdownV2' })
}

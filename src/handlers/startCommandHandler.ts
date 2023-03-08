import { Update } from 'telegraf/typings/core/types/typegram'

import { HandlerBuilder } from '../models/Buildes'

export const buildStartCommandHandler: HandlerBuilder<Update.MessageUpdate> = ({ log: logger }) => async ctx => {
  /* istanbul ignore next */
  logger.trace({ chatId: ctx.chat?.id }, "Executing command '/start'")

  await ctx.reply(ctx.t('commands.start') as string, { parse_mode: 'MarkdownV2' })
}

import {Update} from 'telegraf/typings/core/types/typegram'

import {HandlerBuilder} from '../models/Buildes'

export const buildStartCommandHandler: HandlerBuilder<Update.MessageUpdate> = () => async ctx => {
  await ctx.reply(ctx.t('errors.test'))
}

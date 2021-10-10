import {Middleware, Context} from 'telegraf'

const collectCommandHandler: Middleware<Context> = async ctx => {
  await ctx.reply('Collecting process explanation...')
}

export default collectCommandHandler

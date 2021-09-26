import {Middleware, Context} from 'telegraf'

const collectCommandHandler: Middleware<Context> = async ctx => {
  await ctx.reply('Start collect process...')
}

export default collectCommandHandler

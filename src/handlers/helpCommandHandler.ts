import {Middleware, Context} from 'telegraf'

const helpCommandHandler: Middleware<Context> = async ctx => {
  await ctx.reply('Test')
}

export default helpCommandHandler

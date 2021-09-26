import {Middleware, Context} from 'telegraf'

const helpCommandHandler: Middleware<Context> = async ctx => {
  await ctx.reply('This is the help message...')
}

export default helpCommandHandler

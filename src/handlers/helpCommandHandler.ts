import {Middleware, Context} from 'telegraf'

export const helpCommandHandler: Middleware<Context> = async ctx => {
  await ctx.reply('This is the help message...')
}

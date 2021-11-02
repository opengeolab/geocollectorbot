import {Middleware, Context} from 'telegraf'

export const startCommandHandler: Middleware<Context> = async ctx => {
  await ctx.reply('This is the start message...')
}

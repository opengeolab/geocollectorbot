import {Middleware, Context} from 'telegraf'

const startCommandHandler: Middleware<Context> = async ctx => {
  await ctx.reply('This is the start message...')
}

export default startCommandHandler

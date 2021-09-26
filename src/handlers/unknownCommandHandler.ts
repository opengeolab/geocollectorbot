import {Middleware, Context} from 'telegraf'

const unknownCommandHandler: Middleware<Context> = async ctx => {
  await ctx.reply('Unknown command!')
}

export default unknownCommandHandler

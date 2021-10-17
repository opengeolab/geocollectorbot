import {Middleware, Context} from 'telegraf'
import {FastifyInstance} from 'fastify'

export const buildCollectCommandHandler = (service: FastifyInstance): Middleware<Context> => {
  const {storageClient} = service

  return async ctx => {
    const chatId = ctx.chat?.id
    if (!chatId) { await ctx.reply('Error! Cannot recognize the chat') }

    // TODO check if there is already an ongoing interaction

    await storageClient.createInteraction(chatId as number)

    await ctx.reply('Collecting process explanation...')
  }
}

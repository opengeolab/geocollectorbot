import {Middleware, Context} from 'telegraf'
import {FastifyInstance} from 'fastify'

import {resolveLocalizedText} from '../utils/localizer'

export const buildCollectCommandHandler = (service: FastifyInstance): Middleware<Context> => {
  const {storageClient, configuration} = service
  const {flow: {firstStepId, steps}} = configuration

  return async ctx => {
    const {chat, from: user} = ctx

    const chatId = chat?.id
    if (!chatId) {
      await ctx.reply('Error! Cannot recognize the chat')
      return
    }

    // TODO check if there is already an ongoing interaction

    try {
      await storageClient.createInteraction(chatId as number, firstStepId)
    } catch (error) {
      service.log.error({error, chatId}, 'Error during interaction creation')
      await ctx.reply('Sorry, an error occurred on our side')
      return
    }

    const {question} = steps[firstStepId]
    const localizedQuestion = resolveLocalizedText(question, user?.language_code)

    await ctx.reply(localizedQuestion)
  }
}

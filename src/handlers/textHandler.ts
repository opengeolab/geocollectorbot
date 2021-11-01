import {FastifyInstance} from 'fastify'
import {Context, Middleware} from 'telegraf'
import {Message, Update} from 'telegraf/typings/core/types/typegram'

import {Interaction} from '../models/Interaction'

export const buildTextHandler = (service: FastifyInstance): Middleware<Context> => {
  const {storageClient, configuration} = service
  const {flow: {steps}} = configuration

  return async ctx => {
    const {chat, from: user, message} = ctx as Context<Update.MessageUpdate>
    const {text} = message as Message.TextMessage

    service.log.debug({chat, user}, 'Received a text message')

    const chatId = chat?.id
    if (!chatId) {
      service.log.error({chat, user}, 'Chat id not found')
      await ctx.reply('Error! Cannot recognize the chat')
      return
    }

    let interaction: Interaction
    try {
      interaction = await storageClient.getOngoingInteraction(chatId)
    } catch (error) {
      service.log.error({error}, 'Error getting interaction')
      await ctx.reply('Error getting interaction')
      return
    }

    const {currStepId} = interaction
    const currStep = steps[currStepId]
    if (!currStep) {
      service.log.error('No step found')
      await ctx.reply('No step found')
      return
    }

    await ctx.reply('Hey there!')
  }
}

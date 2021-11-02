import {Message, Update} from 'telegraf/typings/core/types/typegram'

import {HandlerBuilder} from '../models/Buildes'

export const buildTextHandler: HandlerBuilder<Update.MessageUpdate> = ({storageClient, configuration, log: logger}) => {
  const {flow: {steps}} = configuration

  return async ctx => {
    const {chatId, message} = ctx
    // const {text} = message as Message.TextMessage

    logger.debug({chatId, message}, 'Received a text message')

    // const {currStepId} = interaction
    // const currStep = steps[currStepId]
    // if (!currStep) {
    //   service.log.error('No step found')
    //   await ctx.reply('No step found')
    //   return
    // }
    //
    // await ctx.reply('Hey there!')
  }
}

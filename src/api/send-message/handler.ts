import { RouteHandlerMethod } from 'fastify/types/route'
import { RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from 'fastify/types/utils'

import { Body, ResponseError } from './schema'

interface RejectedReason {
  on?: {
    method?: string
    payload?: { chat_id?: string; text?: string }
  }
  message?: string
}

const handler: RouteHandlerMethod<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  {Body: Body}
> = async function (request, reply) {
  const { bot, log } = this
  log.debug('POST - /send-message', { body: request.body })

  const { body: { chatIds, message } } = request

  const promises = chatIds.map(chatId => bot.telegram.sendMessage(chatId, message))

  const results = await Promise.allSettled(promises)

  const errors: ResponseError[] = results.reduce((acc, currResult) => {
    if (currResult.status === 'fulfilled') { return acc }

    const { on, message: errorMsg } = currResult.reason as RejectedReason

    return [
      ...acc,
      {
        chatId: on?.payload?.chat_id,
        message: errorMsg || 'Something went wrong',
      },
    ]
  }, [] as ResponseError[])

  reply.status(200).send({ errors })
}

export default handler

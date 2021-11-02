import {onCloseHookHandler} from 'fastify/types/hooks'

export const onFastifyCloseHandler: onCloseHookHandler = (fastify, done) => {
  const {bot, storageClient} = fastify

  bot?.stop()
  storageClient?.stop()

  done()
}

import {onCloseHookHandler} from 'fastify/types/hooks'

export const onFastifyCloseHandler: onCloseHookHandler = (fastify, done) => {
  const {bot, storageClient, log: logger} = fastify

  logger.info('Shutting down bot and storage client')

  bot?.stop()
  storageClient?.stop()

  done()
}

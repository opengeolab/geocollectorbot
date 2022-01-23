import { onCloseHookHandler } from 'fastify/types/hooks'

export const onFastifyCloseHandler: onCloseHookHandler = (fastify, done) => {
  const { bot, dataStorageClient, log: logger } = fastify

  logger.info('Shutting down bot and storage client')

  bot?.stop()
  dataStorageClient?.stop()

  done()
}

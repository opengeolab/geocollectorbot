import fastifyBuilder, {FastifyInstance, FastifyServerOptions} from 'fastify'
import {onCloseHookHandler} from 'fastify/types/hooks'

import {loadEnv, decorateEnv} from './setup/environment'
import {decorateBot} from './setup/bot'
import {decorateStorageClient} from './clients/storage'
import {decorateConfiguration} from './setup/configuration'

import {buildCollectCommandHandler} from './handlers/collectCommandHandler'

const onFastifyCloseHandler: onCloseHookHandler = (fastify, done) => {
  const {bot, storageClient} = fastify

  bot?.stop()
  storageClient?.stop()

  done()
}

const launchFastify = async() => {
  const environment = loadEnv()

  const fastifyOpts: FastifyServerOptions = {
    logger: {level: environment.LOG_LEVEL},
  }

  const fastify: FastifyInstance = fastifyBuilder(fastifyOpts)

  decorateEnv(fastify, environment)
  await decorateConfiguration(fastify)
  decorateBot(fastify)
  decorateStorageClient(fastify)

  fastify.bot.command('collect', buildCollectCommandHandler(fastify))
  await fastify.bot.launch()

  fastify.addHook('onClose', onFastifyCloseHandler)

  await fastify.ready()

  await fastify.listen(environment.HTTP_PORT, '0.0.0.0')
}

launchFastify()

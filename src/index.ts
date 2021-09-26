import fastifyBuilder, {FastifyInstance, FastifyServerOptions} from 'fastify'
import {onCloseHookHandler} from 'fastify/types/hooks'

import loadEnv from './setup/environment'
import buildBot from './setup/bot'
import helpCommandHandler from './handlers/helpCommandHandler'
import startCommandHandler from './handlers/startCommandHandler'
import collectCommandHandler from './handlers/collectCommandHandler'

const onFastifyCloseHandler: onCloseHookHandler = (fastify, done) => {
  fastify.bot.stop()
  done()
}

const launchFastify = async() => {
  const environment = loadEnv()

  const fastifyOpts: FastifyServerOptions = {
    logger: {level: environment.LOG_LEVEL},
  }

  const fastify: FastifyInstance = fastifyBuilder(fastifyOpts)

  fastify.decorate('config', environment)

  const bot = buildBot(environment)
  fastify.decorate('bot', bot)

  bot.command('help', helpCommandHandler)
  bot.command('start', startCommandHandler)
  bot.command('collect', collectCommandHandler)

  await bot.launch()

  fastify.addHook('onClose', onFastifyCloseHandler)

  await fastify.ready()

  await fastify.listen(environment.HTTP_PORT, '0.0.0.0')
}

launchFastify()

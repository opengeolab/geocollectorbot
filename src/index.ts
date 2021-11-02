import fastifyBuilder, {FastifyInstance, FastifyServerOptions} from 'fastify'

import {decorateStorageClient} from './clients/storage'
import {buildCollectCommandHandler} from './handlers/collectCommandHandler'
import {helpCommandHandler} from './handlers/helpCommandHandler'
import {startCommandHandler} from './handlers/startCommandHandler'
import {buildTextHandler} from './handlers/textHandler'
import {onFastifyCloseHandler} from './hooks/onFastifyClose'
import {buildExtractInfoMiddleware} from './middlewares/extractInfo'
import {buildHandleErrorMiddleware} from './middlewares/handleError'
import {buildRetrieveInteractionMiddleware} from './middlewares/retrieveInteraction'
import {decorateBot} from './setup/bot'
import {decorateConfiguration} from './setup/configuration'
import {loadEnv, decorateEnv} from './setup/environment'

const launchFastify = async () => {
  const environment = loadEnv()

  const fastifyOpts: FastifyServerOptions = {
    logger: {level: environment.LOG_LEVEL},
  }

  const fastify: FastifyInstance = fastifyBuilder(fastifyOpts)

  decorateEnv(fastify, environment)
  await decorateConfiguration(fastify)
  decorateBot(fastify)
  decorateStorageClient(fastify)

  fastify.bot
    .start(startCommandHandler)
    .help(helpCommandHandler)
    .use(buildExtractInfoMiddleware(fastify))
    .command('collect', buildCollectCommandHandler(fastify))
    .use(buildRetrieveInteractionMiddleware(fastify))
    .on('text', buildTextHandler(fastify))
    .catch(buildHandleErrorMiddleware(fastify))

  await fastify.bot.launch()

  fastify.addHook('onClose', onFastifyCloseHandler)

  await fastify.ready()

  await fastify.listen(environment.HTTP_PORT, '0.0.0.0')
}

launchFastify()

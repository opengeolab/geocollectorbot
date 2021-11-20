import fastifyBuilder, {FastifyInstance, FastifyServerOptions} from 'fastify'

import {decorateDataStorageClient} from './clients/dataStorage'
import {decorateMediaStorageClient} from './clients/mediaStorage'
import {buildCollectCommandHandler} from './handlers/collectCommandHandler'
import {buildHelpCommandHandler} from './handlers/helpCommandHandler'
import {buildLocationHandler} from './handlers/locationHandler'
import {buildPhotoHandler} from './handlers/photoHandler'
import {buildStartCommandHandler} from './handlers/startCommandHandler'
import {buildTextHandler} from './handlers/textHandler'
import {onFastifyCloseHandler} from './hooks/onFastifyClose'
import {buildExtractInfoMiddleware} from './middlewares/extractInfo'
import {buildHandleErrorMiddleware} from './middlewares/handleError'
import {buildRetrieveInteractionMiddleware} from './middlewares/retrieveInteraction'
import {buildSetLanguageMiddleware} from './middlewares/setLanguage'
import {decorateBot} from './setup/bot'
import {decorateConfiguration} from './setup/configuration'
import {loadEnv, decorateEnv} from './setup/environment'
import {decorateI18n} from './setup/i18n'

const launchFastify = async () => {
  const environment = loadEnv()

  const fastifyOpts: FastifyServerOptions = {
    logger: {level: environment.LOG_LEVEL},
  }

  const fastify: FastifyInstance = fastifyBuilder(fastifyOpts)

  decorateEnv(fastify, environment)
  await decorateI18n(fastify)
  await decorateConfiguration(fastify)
  decorateBot(fastify)
  decorateDataStorageClient(fastify)
  decorateMediaStorageClient(fastify)

  fastify.bot
    .use(buildSetLanguageMiddleware(fastify))
    .start(buildStartCommandHandler(fastify))
    .help(buildHelpCommandHandler(fastify))
    //
    .use(buildExtractInfoMiddleware(fastify))
    .command('collect', buildCollectCommandHandler(fastify))
    //
    .use(buildRetrieveInteractionMiddleware(fastify))
    .on('text', buildTextHandler(fastify))
    .on('location', buildLocationHandler(fastify))
    .on('photo', buildPhotoHandler(fastify))
    //
    .catch(buildHandleErrorMiddleware(fastify))

  await fastify.bot.launch()

  fastify.addHook('onClose', onFastifyCloseHandler)

  await fastify.ready()

  await fastify.listen(environment.HTTP_PORT, '0.0.0.0')
}

launchFastify()

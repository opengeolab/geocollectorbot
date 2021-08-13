import fastifyBuilder, {FastifyInstance, FastifyServerOptions} from 'fastify'
import loadEnv from './setup/loadEnv'

const launchFastify = async() => {
  const environment = loadEnv()

  const fastifyOpts: FastifyServerOptions = {
    logger: {level: environment.LOG_LEVEL},
  }

  const fastify: FastifyInstance = fastifyBuilder(fastifyOpts)

  fastify.decorate('config', environment)

  await fastify.ready()

  await fastify.listen(environment.HTTP_PORT, '0.0.0.0')
}

launchFastify()

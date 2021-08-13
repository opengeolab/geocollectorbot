/* eslint-disable no-console */
import Fastify, {FastifyInstance} from 'fastify'
import fastifyEnv, {fastifyEnvOpt} from 'fastify-env'

import {envSchema} from './models/env'

const options: fastifyEnvOpt = {
  schema: envSchema,
  dotenv: true,
}

const fastify: FastifyInstance = Fastify()
fastify.register(fastifyEnv, options)

fastify.get('/ping', async(request, reply) => {
  return 'pong\n'
})

fastify.listen(8000, (error, address) => {
  if (error) {
    console.error(error)
    throw error
  }

  console.log(fastify.config)

  console.log(`Server listening at ${address}`)
})

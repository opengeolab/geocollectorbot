import {envSchema, EnvSchemaData} from 'env-schema'
import {FastifyInstance} from 'fastify'

import {Environment, environmentSchema} from '../schemas/environment'

const options: EnvSchemaData = {
  schema: environmentSchema,
  dotenv: true,
}

export const loadEnv = (): Environment => envSchema(options) as Environment

export const decorateEnv = (service: Pick<FastifyInstance, 'decorate'>, env: Environment) => service.decorate('env', env)

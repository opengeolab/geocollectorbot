import {envSchema, EnvSchemaData} from 'env-schema'

import {Environment, environmentSchema} from '../models/environment'

const options: EnvSchemaData = {
  schema: environmentSchema,
  dotenv: true,
}

const loadEnv = (): Environment => envSchema(options) as Environment

export default loadEnv

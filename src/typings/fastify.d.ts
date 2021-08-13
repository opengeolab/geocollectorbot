/* eslint-disable */
import fastify from 'fastify'

import {Environment} from '../models/environment'

declare module 'fastify' {
  interface FastifyInstance {
    config: Environment
  }
}

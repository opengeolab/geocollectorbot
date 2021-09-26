/* eslint-disable */
import fastify from 'fastify'
import {Telegraf} from 'telegraf'

import {Environment} from '../models/environment'

declare module 'fastify' {
  interface FastifyInstance {
    config: Environment
    bot: Telegraf
  }
}

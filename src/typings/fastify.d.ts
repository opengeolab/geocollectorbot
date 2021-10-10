/* eslint-disable */
import fastify from 'fastify'
import {Telegraf} from 'telegraf'

import {Environment} from '../schemas/environment'
import {Configuration} from '../schemas/configuration'
import {StorageClient} from '../clients/storage'

declare module 'fastify' {
  interface FastifyInstance {
    env: Environment
    configuration: Configuration
    bot: Telegraf
    storageClient: StorageClient
  }
}

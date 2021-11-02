/* eslint-disable */
import fastify from 'fastify'
import {Telegraf} from 'telegraf'

import {Environment} from '../schemas/environment'
import {StorageClient} from '../clients/storage'
import {Configuration} from '../models/Configuration'
import {DecoratedContext} from '../models/DecoratedContext'

declare module 'fastify' {
  interface FastifyInstance {
    env: Environment
    configuration: Configuration
    bot: Telegraf<DecoratedContext>
    storageClient: StorageClient
  }
}

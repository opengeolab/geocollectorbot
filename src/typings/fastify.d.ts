// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fastify from 'fastify'
import {i18n} from 'i18next'
import {Telegraf} from 'telegraf'

import {DataStorageClient} from '../clients/dataStorage'
import {Configuration} from '../models/Configuration'
import {DecoratedContext} from '../models/DecoratedContext'
import {Environment} from '../schemas/environment'

declare module 'fastify' {
  interface FastifyInstance {
    env: Environment
    configuration: Configuration
    i18n: i18n
    bot: Telegraf<DecoratedContext>
    dataStorageClient: DataStorageClient
  }
}

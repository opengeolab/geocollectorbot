import {FastifyInstance} from 'fastify'
import {Telegraf} from 'telegraf'

import {DecoratedContext} from '../models/DecoratedContext'
import {Environment} from '../schemas/environment'

const buildBot = ({TELEGRAM_AUTH_TOKEN}: Environment) => {
  return new Telegraf<DecoratedContext>(TELEGRAM_AUTH_TOKEN)
}

export const decorateBot = (service: Pick<FastifyInstance, 'env' | 'decorate'>) => {
  const {env} = service

  const bot = buildBot(env)
  service.decorate('bot', bot)
}

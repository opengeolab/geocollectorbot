import {FastifyInstance} from 'fastify'
import {Telegraf} from 'telegraf'

import {Environment} from '../schemas/environment'

const buildBot = ({TELEGRAM_AUTH_TOKEN}: Environment) => {
  return new Telegraf(TELEGRAM_AUTH_TOKEN)
}

export const decorateBot = (service: Pick<FastifyInstance, 'env' | 'decorate'>) => {
  const {env} = service

  const bot = buildBot(env)
  service.decorate('bot', bot)
}

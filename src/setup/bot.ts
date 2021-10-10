import {FastifyInstance} from 'fastify'
import {Telegraf} from 'telegraf'

import {Environment} from '../schemas/environment'

const buildBot = ({TELEGRAM_AUTH_TOKEN}: Environment) => {
  return new Telegraf(TELEGRAM_AUTH_TOKEN)
}

export const decorateBot = (service: FastifyInstance) => {
  const {env, decorate} = service

  const bot = buildBot(env)
  decorate('bot', bot)
}

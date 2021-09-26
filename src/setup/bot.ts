import {Telegraf} from 'telegraf'

import {Environment} from '../models/Environment'

const buildBot = ({TELEGRAM_AUTH_TOKEN}: Environment) => {
  return new Telegraf(TELEGRAM_AUTH_TOKEN)
}

export default buildBot

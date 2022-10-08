import { BotConfiguration } from '../schemas/config'

import { ParsedFlow } from './Flow'

export type Configuration = Omit<BotConfiguration, 'flow'> & {
  flow: ParsedFlow
}

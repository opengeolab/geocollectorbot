import { RawConfiguration } from '../schemas/configuration'

import { Flow } from './Flow'

export type Configuration = Omit<RawConfiguration, 'flow'> & {
  flow: Flow
}

import {RawConfiguration} from '../schemas/configuration'
import {RawFlow} from '../schemas/configuration/flow'
import {LocalizedText} from '../schemas/localizedText'

export type Step = {
  id: string
  question: LocalizedText
  nextStepId?: string
}

export type Steps = Record<string, Step>

export type Flow = Omit<RawFlow, 'steps'> & {
  steps: Steps
}

export type Configuration = Omit<RawConfiguration, 'flow'> & {
  flow: Flow
}

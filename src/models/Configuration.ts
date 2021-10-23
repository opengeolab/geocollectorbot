import {RawConfiguration} from '../schemas/configuration'
import {LocalizedText} from '../schemas/localizedText'
import {RawFlow} from '../schemas/configuration/flow'

export type Step = {
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

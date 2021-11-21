import {RawFlow} from '../schemas/configuration/flow'
import {LocationStepConfig, MediaStepConfig, TextStepConfig} from '../schemas/configuration/flow/step'
import {LocalizedText} from '../schemas/localizedText'

export enum StepType {
  TEXT = 'text',
  LOCATION = 'location',
  MEDIA = 'media'
}

export enum MediaStepSubtype {
  PHOTO = 'photo'
}

export type StepConfig = TextStepConfig | LocationStepConfig | MediaStepConfig

export type Step = {
  id: string
  question: LocalizedText
  config: StepConfig
  persistAs: string
  nextStepId?: string
}

export type Steps = Record<string, Step>

export type Flow = Omit<RawFlow, 'steps'> & {
  steps: Steps
}

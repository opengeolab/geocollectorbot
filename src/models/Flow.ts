import { RawFlow } from '../schemas/configuration/flow'
import { StepConfig } from '../schemas/configuration/flow/stepConfig'
import { LocalizedText } from '../schemas/localizedText'

export enum StepType {
  TEXT = 'text',
  MULTIPLE_CHOICE = 'multipleChoice',
  LOCATION = 'location',
  MEDIA = 'media'
}

export enum MediaStepSubtype {
  PHOTO = 'photo'
}

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

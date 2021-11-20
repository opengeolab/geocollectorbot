import {RawFlow} from '../schemas/configuration/flow'
import {LocalizedText} from '../schemas/localizedText'

export enum StepType {
  TEXT = 'text',
  LOCATION = 'location',
  PHOTO = 'photo'
}

export type Step = {
  id: string
  question: LocalizedText
  type: StepType
  persistAs: string
  nextStepId?: string
}

export type Steps = Record<string, Step>

export type Flow = Omit<RawFlow, 'steps'> & {
  steps: Steps
}

import type { Flow, FlowStep } from '../schemas/config'

export enum StepType {
  TEXT = 'text',
  MULTIPLE_CHOICE = 'multipleChoice',
  LOCATION = 'location',
  MEDIA = 'media'
}

export enum MediaStepSubtype {
  PHOTO = 'photo'
}

export type ParsedSteps = Record<string, FlowStep>

export type ParsedFlow = Omit<Flow, 'steps'> & {
  steps: ParsedSteps
}

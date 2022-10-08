import type { Flow, FlowStep } from '../schemas/config'

export enum StepType {
  TEXT = 'text',
  MULTIPLE_CHOICE = 'multipleChoice',
  LOCATION = 'location',
  SINGLE_MEDIA = 'singleMedia',
  MULTIPLE_MEDIA = 'multipleMedia'
}

export enum MediaStepSubtype {
  PHOTO = 'photo',
  VIDEO = 'video'
}

export type ParsedSteps = Record<string, FlowStep>

export type ParsedFlow = Omit<Flow, 'steps'> & {
  steps: ParsedSteps
}

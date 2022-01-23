import { locationStepConfigSchema, LocationStepConfig } from './location'
import { mediaStepConfigSchema, MediaStepConfig } from './media'
import { multipleChoiceStepConfigSchema, MultipleChoiceStepConfig } from './multipleChoice'
import { textStepConfigSchema, TextStepConfig } from './text'

export const stepConfigSchemas = [
  textStepConfigSchema,
  multipleChoiceStepConfigSchema,
  locationStepConfigSchema,
  mediaStepConfigSchema,
]

export type StepConfig = LocationStepConfig | MediaStepConfig | MultipleChoiceStepConfig | TextStepConfig

export type {
  LocationStepConfig,
  MediaStepConfig,
  MultipleChoiceStepConfig,
  TextStepConfig,
}

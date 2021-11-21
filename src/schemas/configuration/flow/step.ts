import {FromSchema} from 'json-schema-to-ts'

import {MediaStepSubtype, StepType} from '../../../models/Flow'
import {localizedTextSchema} from '../../localizedText'

export const textStepConfigSchema = {
  type: 'object',
  properties: {
    type: {type: 'string', const: StepType.TEXT},
  },
  additionalProperties: false,
  required: ['type'],
} as const

export type TextStepConfig = FromSchema<typeof textStepConfigSchema>

export const locationStepConfigSchema = {
  type: 'object',
  properties: {
    type: {type: 'string', const: StepType.LOCATION},
  },
  additionalProperties: false,
  required: ['type'],
} as const

export type LocationStepConfig = FromSchema<typeof locationStepConfigSchema>

export const mediaStepConfigSchema = {
  type: 'object',
  properties: {
    type: {type: 'string', const: StepType.MEDIA},
    subType: {type: 'string', const: MediaStepSubtype.PHOTO},
  },
  additionalProperties: false,
  required: ['type', 'subType'],
} as const

export type MediaStepConfig = FromSchema<typeof mediaStepConfigSchema>

export const stepSchema = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    question: localizedTextSchema,
    config: {
      oneOf: [
        textStepConfigSchema,
        locationStepConfigSchema,
        mediaStepConfigSchema,
      ],
    },
    persistAs: {type: 'string'},
    nextStepId: {type: 'string'},
  },
  additionalProperties: false,
  required: ['id', 'question', 'config'],
} as const

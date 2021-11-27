import {FromSchema} from 'json-schema-to-ts'

import {MediaStepSubtype, StepType} from '../../../../models/Flow'

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

import { FromSchema } from 'json-schema-to-ts'

import { MediaStepSubtype, StepType } from '../../../../models/Flow'

export const mediaStepConfigSchema = {
  type: 'object',
  properties: {
    type: { const: StepType.MEDIA },
    subType: { const: MediaStepSubtype.PHOTO },
  },
  additionalProperties: false,
  required: ['type', 'subType'],
} as const

export type MediaStepConfig = FromSchema<typeof mediaStepConfigSchema>

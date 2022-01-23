import { FromSchema } from 'json-schema-to-ts'

import { StepType } from '../../../../models/Flow'

export const textStepConfigSchema = {
  type: 'object',
  properties: {
    type: { const: StepType.TEXT },
  },
  additionalProperties: false,
  required: ['type'],
} as const

export type TextStepConfig = FromSchema<typeof textStepConfigSchema>

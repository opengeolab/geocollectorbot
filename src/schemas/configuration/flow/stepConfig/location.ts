import {FromSchema} from 'json-schema-to-ts'

import {StepType} from '../../../../models/Flow'

export const locationStepConfigSchema = {
  type: 'object',
  properties: {
    type: {type: 'string', const: StepType.LOCATION},
  },
  additionalProperties: false,
  required: ['type'],
} as const

export type LocationStepConfig = FromSchema<typeof locationStepConfigSchema>

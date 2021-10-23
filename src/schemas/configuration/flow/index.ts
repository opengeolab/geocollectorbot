import {FromSchema} from 'json-schema-to-ts'

import {stepSchema} from './step'

export const flowSchema = {
  type: 'object',
  properties: {
    firstStepId: {type: 'string'},
    steps: {
      type: 'array',
      items: stepSchema,
      minItems: 1,
    },
  },
  additionalProperties: false,
  required: ['firstStepId', 'steps'],
} as const

export type RawFlow = FromSchema<typeof flowSchema>

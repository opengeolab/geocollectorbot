import { FromSchema } from 'json-schema-to-ts'

import { RawStep, stepSchema } from './step'

const flowSchemaForType = {
  type: 'object',
  properties: {
    firstStepId: { type: 'string' },
  },
  additionalProperties: false,
  required: ['firstStepId'],
} as const

export const flowSchema = {
  type: 'object',
  properties: {
    ...flowSchemaForType.properties,
    steps: {
      type: 'array',
      items: stepSchema,
      minItems: 1,
    },
  },
  additionalProperties: false,
  required: [...flowSchemaForType.required, 'steps'],
}

export type RawFlow = FromSchema<typeof flowSchemaForType> & { steps: RawStep[] }

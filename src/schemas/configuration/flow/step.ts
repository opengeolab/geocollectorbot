import { FromSchema } from 'json-schema-to-ts'

import { localizedTextSchema } from '../../localizedText'

import { StepConfig, stepConfigSchemas } from './stepConfig'

const stepSchemaForType = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    question: localizedTextSchema,
    persistAs: { type: 'string' },
    nextStepId: { type: 'string' },
  },
  additionalProperties: false,
  required: ['id', 'question'],
} as const

export const stepSchema = {
  type: 'object',
  properties: {
    ...stepSchemaForType.properties,
    config: { oneOf: stepConfigSchemas },
  },
  additionalProperties: false,
  required: [...stepSchemaForType.required, 'config'],
}

export type RawStep = FromSchema<typeof stepSchemaForType> & { config: StepConfig }

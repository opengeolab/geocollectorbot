import { FromSchema } from 'json-schema-to-ts'

import { localizedTextSchema } from '../../localizedText'

import { StepConfig, stepConfigSchemas } from './stepConfig'

export const stepSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    question: localizedTextSchema,
    config: { oneOf: stepConfigSchemas },
    persistAs: { type: 'string' },
    nextStepId: { type: 'string' },
  },
  additionalProperties: false,
  required: ['id', 'question', 'config'],
} as const

export type RawStep = Omit<FromSchema<typeof stepSchema>, 'config'> & { config: StepConfig }

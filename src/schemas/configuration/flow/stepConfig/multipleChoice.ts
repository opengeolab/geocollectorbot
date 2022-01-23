import { FromSchema } from 'json-schema-to-ts'

import { StepType } from '../../../../models/Flow'
import { localizedTextSchema } from '../../../localizedText'

export const multipleChoiceStepConfigSchema = {
  type: 'object',
  properties: {
    type: { const: StepType.MULTIPLE_CHOICE },
    options: {
      type: 'array',
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            text: localizedTextSchema,
            value: { type: 'string' },
          },
          required: ['text', 'value'],
          additionalProperties: false,
        },
        minItems: 1,
      },
      minItems: 1,
    },
  },
  additionalProperties: false,
  required: ['type', 'options'],
} as const

export type MultipleChoiceStepConfig = FromSchema<typeof multipleChoiceStepConfigSchema>

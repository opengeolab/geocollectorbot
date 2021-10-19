import {localizedTextSchema} from '../../localizedText'

export const stepSchema = {
  type: 'object',
  properties: {
    id: 'string',
    question: localizedTextSchema,
    nextStep: 'string',
  },
  additionalProperties: false,
  required: ['id', 'question'],
} as const

import {localizedTextSchema} from '../../localizedText'

export const stepSchema = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    question: localizedTextSchema,
    nextStepId: {type: 'string'},
  },
  additionalProperties: false,
  required: ['id', 'question'],
} as const

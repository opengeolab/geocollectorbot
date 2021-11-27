import {localizedTextSchema} from '../../localizedText'

import {stepConfigSchemas} from './stepConfig'

export const stepSchema = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    question: localizedTextSchema,
    config: {
      oneOf: stepConfigSchemas,
    },
    persistAs: {type: 'string'},
    nextStepId: {type: 'string'},
  },
  additionalProperties: false,
  required: ['id', 'question', 'config'],
} as const

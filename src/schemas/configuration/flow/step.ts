import {StepType} from '../../../models/Flow'
import {localizedTextSchema} from '../../localizedText'

export const stepSchema = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    question: localizedTextSchema,
    type: {
      type: 'string',
      enum: [StepType.TEXT],
    },
    persistAs: {type: 'string'},
    nextStepId: {type: 'string'},
  },
  additionalProperties: false,
  required: ['id', 'question', 'type'],
} as const

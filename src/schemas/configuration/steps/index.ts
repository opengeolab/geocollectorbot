import {stepSchema} from './step'

export const stepsSchema = {
  type: 'array',
  items: stepSchema,
  minItems: 1,
} as const

import { FastifySchema } from 'fastify'

import { BaseInteractionKeys } from '../../models/Interaction'
import { apiErrorResponseSchema } from '../../schemas/apiErrorResponse'

const responseSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      [BaseInteractionKeys.ID]: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      [BaseInteractionKeys.CHAT_ID]: { type: 'number' },
      [BaseInteractionKeys.USERNAME]: { type: 'string' },
      [BaseInteractionKeys.CURRENT_STEP_ID]: { type: 'string' },
      [BaseInteractionKeys.INTERACTION_STATE]: { type: 'string' },
      [BaseInteractionKeys.CREATED_AT]: { type: 'string' },
      [BaseInteractionKeys.UPDATED_AT]: { type: 'string' },
    },
    additionalProperties: true,
  },
}

const schema: FastifySchema = {
  response: {
    '4xx': apiErrorResponseSchema,
    '5xx': apiErrorResponseSchema,
    200: responseSchema,
  },
}

export default schema

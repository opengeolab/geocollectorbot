import { FastifySchema } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

const bodySchema = {
  type: 'object',
  properties: {
    chatIds: {
      type: 'array',
      items: { type: 'string' },
    },
    message: { type: 'string' },
  },
  required: ['chatIds', 'message'],
  additionalProperties: false,
} as const

export type Body = FromSchema<typeof bodySchema>

const responseErrorSchema = {
  type: 'object',
  properties: {
    chatId: { type: 'string' },
    message: { type: 'string' },
  },
} as const

export type ResponseError = FromSchema<typeof responseErrorSchema>

const responseSchema = {
  type: 'object',
  properties: {
    errors: {
      type: 'array',
      items: responseErrorSchema,
    },
  },
}

const schema: FastifySchema = {
  body: bodySchema,
  response: {
    200: responseSchema,
  },
}

export default schema

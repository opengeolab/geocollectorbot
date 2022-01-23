import { FromSchema } from 'json-schema-to-ts'

export const pgConfigurationSchema = {
  type: 'object',
  properties: {
    user: { type: 'string' },
    password: { type: 'string' },
    host: { type: 'string' },
    database: { type: 'string' },
    port: { type: 'number' },
    interactionsTable: { type: 'string' },
  },
  additionalProperties: false,
  required: ['user', 'password', 'host', 'database', 'port', 'interactionsTable'],
} as const

export const pgSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'postgres',
    },
    configuration: pgConfigurationSchema,
  },
  additionalProperties: false,
  required: ['type', 'configuration'],
} as const

export type PgConfiguration = FromSchema<typeof pgConfigurationSchema>

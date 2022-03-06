import { FromSchema } from 'json-schema-to-ts'

export const pgConfigurationSchema = {
  type: 'object',
  properties: {
    connectionString: { type: 'string' },
    interactionsTable: { type: 'string' },
    ssl: { type: 'boolean', default: false },
  },
  additionalProperties: false,
  required: ['connectionString', 'interactionsTable', 'ssl'],
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

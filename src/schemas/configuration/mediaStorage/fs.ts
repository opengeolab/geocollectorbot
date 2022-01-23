import { FromSchema } from 'json-schema-to-ts'

export const fsConfigurationSchema = {
  type: 'object',
  properties: {
    folderPath: { type: 'string' },
  },
  additionalProperties: false,
  required: ['folderPath'],
} as const

export const fsSchema = {
  type: 'object',
  properties: {
    type: { const: 'fileSystem' },
    configuration: fsConfigurationSchema,
  },
  additionalProperties: false,
  required: ['type', 'configuration'],
} as const

export type FsConfiguration = FromSchema<typeof fsConfigurationSchema>

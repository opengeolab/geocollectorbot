import fs from 'fs/promises'

import Ajv from 'ajv'
import { FastifyInstance } from 'fastify'

import { parseFlow } from '../lib/configurationParser'
import { Configuration } from '../models/Configuration'
import { configurationSchema, RawConfiguration } from '../schemas/configuration'
import { interpolateEnv } from '../utils/envInterpolator'

export const retrieveConfiguration = async (service: FastifyInstance): Promise<Configuration> => {
  const { env: { CONFIGURATION_PATH }, log: logger } = service

  const fileContent = await fs.readFile(CONFIGURATION_PATH)
  const configurationContent: RawConfiguration = JSON.parse(fileContent.toString('utf-8'))

  const configValidator = new Ajv().compile(configurationSchema)

  const isConfigValid = configValidator(configurationContent)
  if (!isConfigValid) {
    throw new Error(`Invalid configuration: ${JSON.stringify(configValidator.errors)}`)
  }

  const parsedFlow = parseFlow(configurationContent, logger)

  interpolateEnv(configurationContent.dataStorage)
  configurationContent.mediaStorage && interpolateEnv(configurationContent.mediaStorage)

  return {
    settings: configurationContent.settings,
    dataStorage: configurationContent.dataStorage,
    mediaStorage: configurationContent.mediaStorage,
    flow: parsedFlow,
  }
}

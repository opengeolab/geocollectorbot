import fs from 'fs/promises'

import Ajv from 'ajv'
import {FastifyInstance} from 'fastify'

import {Configuration} from '../models/Configuration'
import {configurationSchema, RawConfiguration} from '../schemas/configuration'

import {parseFlow} from './flow'

const readConfigurationFile = async (configurationPath: string): Promise<RawConfiguration> => {
  const fileContent = await fs.readFile(configurationPath)
  return JSON.parse(fileContent.toString('utf-8'))
}

const validateConfigurationContent = (configurationContent: RawConfiguration): void => {
  const configValidator = new Ajv().compile(configurationSchema)

  const isConfigValid = configValidator(configurationContent)
  if (!isConfigValid) { throw new Error(`Invalid configuration: ${JSON.stringify(configValidator.errors)}`) }
}

const readValidateConfiguration = async (configurationPath: string): Promise<RawConfiguration> => {
  const configurationContent = await readConfigurationFile(configurationPath)

  validateConfigurationContent(configurationContent)
  return configurationContent
}

export const decorateConfiguration = async (service: Pick<FastifyInstance, 'decorate' | 'env' | 'log'>) => {
  const {env: {CONFIGURATION_PATH}} = service

  const {dataStorage: rawDataStorage, flow: rawFlow} = await readValidateConfiguration(CONFIGURATION_PATH)
  const parsedFlow = parseFlow(rawFlow, service.log)

  const configuration: Configuration = {dataStorage: rawDataStorage, flow: parsedFlow}
  service.decorate('configuration', configuration)
}

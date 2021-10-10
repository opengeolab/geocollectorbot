import fs from 'fs/promises'
import {FastifyInstance} from 'fastify'
import Ajv from 'ajv'

import {Configuration, configurationSchema} from '../schemas/configuration'

export const readConfigurationFile = async(configurationPath: string): Promise<Configuration> => {
  const fileContent = await fs.readFile(configurationPath)
  return JSON.parse(fileContent.toString('utf-8'))
}

export const validateConfigurationContent = (configurationContent: Configuration): void => {
  const configValidator = new Ajv().compile(configurationSchema)

  const isConfigValid = configValidator(configurationContent)
  if (!isConfigValid) { throw new Error(`Invalid configuration: ${JSON.stringify(configValidator.errors)}`) }
}

export const readValidateConfiguration = async(configurationPath: string): Promise<Configuration> => {
  const configurationContent = await readConfigurationFile(configurationPath)

  validateConfigurationContent(configurationContent)
  return configurationContent
}

export const decorateConfiguration = async(service: Pick<FastifyInstance, 'decorate' | 'env'>) => {
  const {env: {CONFIGURATION_PATH}, decorate} = service

  const configuration = readValidateConfiguration(CONFIGURATION_PATH)
  decorate('configuration', configuration)
}

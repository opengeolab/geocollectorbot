import fs from 'fs/promises'
import {FastifyInstance} from 'fastify'
import Ajv from 'ajv'

import {Configuration, configurationSchema} from '../schemas/configuration'

const readConfigurationFile = async(configurationPath: string): Promise<Configuration> => {
  const fileContent = await fs.readFile(configurationPath)
  return JSON.parse(fileContent.toString('utf-8'))
}

const validateConfigurationContent = (configurationContent: Configuration): void => {
  const configValidator = new Ajv().compile(configurationSchema)

  const isConfigValid = configValidator(configurationContent)
  if (!isConfigValid) { throw new Error(`Invalid configuration: ${JSON.stringify(configValidator.errors)}`) }
}

const readValidateConfiguration = async(configurationPath: string): Promise<Configuration> => {
  const configurationContent = await readConfigurationFile(configurationPath)

  validateConfigurationContent(configurationContent)
  return configurationContent
}

export const decorateConfiguration = async(service: Pick<FastifyInstance, 'decorate' | 'env'>) => {
  const {env: {CONFIGURATION_PATH}} = service

  const configuration = await readValidateConfiguration(CONFIGURATION_PATH)
  service.decorate('configuration', configuration)
}

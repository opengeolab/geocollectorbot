import { FastifyLoggerInstance } from 'fastify'

import { getDataStorageBaseKeys } from '../clients/dataStorage'
import { Flow, Steps, StepType } from '../models/Flow'
import { BaseInteractionKeys } from '../models/Interaction'
import { RawConfiguration } from '../schemas/configuration'
import { DataStorageConfig } from '../schemas/configuration/dataStorage'
import { RawStep } from '../schemas/configuration/flow/step'
import { MediaStorageConfig } from '../schemas/configuration/mediaStorage'
import { LocalizedText } from '../schemas/localizedText'

const parseSteps = (
  logger: FastifyLoggerInstance,
  rawSteps: RawStep[],
  allStepsIds: string[],
  dataStorageConfig: DataStorageConfig,
  mediaStorageConfig?: MediaStorageConfig
): Steps => {
  const hasMediaStorage = Boolean(mediaStorageConfig)

  const dataStorageBaseKeys = getDataStorageBaseKeys(dataStorageConfig.type)
  const internalBaseKeys = Object.values(BaseInteractionKeys)
  const reservedKeys = new Set([...dataStorageBaseKeys, ...internalBaseKeys])

  const foundDbKeys: string[] = []

  return rawSteps.reduce((currSteps, currRawStep) => {
    const { id, question, nextStepId, config, persistAs } = currRawStep
    const { type } = config
    const dbKey = persistAs || id

    if (currSteps[id]) {
      logger.error({ id }, 'Error parsing steps configuration: id is not unique')
      throw new Error('Error parsing steps configuration: id is not unique')
    }

    if (nextStepId != null && !allStepsIds.includes(nextStepId)) {
      logger.error({ step: currSteps }, 'Error parsing steps configuration: cannot find next step')
      throw new Error('Error parsing steps configuration: cannot find next step')
    }

    if (nextStepId === id) {
      logger.error({ step: currSteps }, 'Error parsing steps configuration: circular dependency')
      throw new Error('Error parsing steps configuration: circular dependency')
    }

    if (foundDbKeys.includes(dbKey)) {
      logger.error({ step: currSteps }, 'Error parsing steps configuration: duplicate db key')
      throw new Error('Error parsing steps configuration: duplicate db key')
    }

    if (reservedKeys.has(dbKey)) {
      logger.error({ step: currSteps, reservedKeys }, 'Error parsing steps configuration: cannot use a db reserved key')
      throw new Error('Error parsing steps configuration: cannot use a db reserved key')
    }

    foundDbKeys.push(dbKey)

    if (type === StepType.MEDIA && !hasMediaStorage) {
      logger.error({ step: currSteps }, 'Error parsing steps configuration: missing media storage config')
      throw new Error('Error parsing steps configuration: missing media storage config')
    }

    currSteps[id] = {
      id,
      question: question as LocalizedText,
      config,
      persistAs: dbKey,
      nextStepId,
    }

    return currSteps
  }, {} as Steps)
}

export const parseFlow = (rawConfig: RawConfiguration, logger: FastifyLoggerInstance): Flow => {
  const { flow: rawFlow, dataStorage, mediaStorage } = rawConfig
  const { firstStepId, steps: rawSteps } = rawFlow

  const allStepsIds = rawSteps.map(step => step.id)

  if (!allStepsIds.includes(firstStepId)) {
    logger.error({ firstStepId }, 'Error parsing flow configuration: cannot find first step')
    throw new Error('Error parsing flow configuration: cannot find first step')
  }

  const parsedSteps = parseSteps(logger, rawSteps, allStepsIds, dataStorage, mediaStorage)

  return { firstStepId, steps: parsedSteps }
}

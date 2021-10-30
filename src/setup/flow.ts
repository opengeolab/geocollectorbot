import {FastifyLoggerInstance} from 'fastify'

import {RawFlow} from '../schemas/configuration/flow'
import {Flow, Steps} from '../models/Configuration'
import {LocalizedText} from '../schemas/localizedText'

export const parseFlow = (rawFlow: RawFlow, logger: FastifyLoggerInstance): Flow => {
  const {firstStepId, steps: rawSteps} = rawFlow

  const allStepsIds = rawSteps.map(step => step.id)

  if (!allStepsIds.includes(firstStepId)) {
    logger.error({firstStepId}, 'Error parsing flow configuration: cannot find first step')
    throw new Error('Error parsing flow configuration: cannot find first step')
  }

  const parsedSteps = parseSteps(rawSteps, logger)

  return {
    firstStepId,
    steps: parsedSteps,
  }
}

const parseSteps = (rawSteps: RawFlow['steps'], logger: FastifyLoggerInstance): Steps => {
  const allStepsIds = rawSteps.map(step => step.id)

  return rawSteps.reduce((currSteps, currRawStep) => {
    const {id, question, nextStepId} = currRawStep

    if (currSteps[id]) {
      logger.error({id}, 'Error parsing steps configuration: id is not unique')
      throw new Error('Error parsing steps configuration: id is not unique')
    }

    if (nextStepId != null && !allStepsIds.includes(nextStepId)) {
      logger.error({step: currSteps}, 'Error parsing steps configuration: cannot find next step')
      throw new Error('Error parsing steps configuration: cannot find next step')
    }

    if (nextStepId === id) {
      logger.error({step: currSteps}, 'Error parsing steps configuration: circular dependency')
      throw new Error('Error parsing steps configuration: circular dependency')
    }

    currSteps[id] = {id, question: question as LocalizedText, nextStepId}

    return currSteps
  }, {} as Steps)
}

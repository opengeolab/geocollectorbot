import {FastifyLoggerInstance} from 'fastify'

import {Flow, Steps} from '../models/Flow'
import {RawFlow} from '../schemas/configuration/flow'
import {LocalizedText} from '../schemas/localizedText'

export const parseFlow = (rawFlow: RawFlow, logger: FastifyLoggerInstance): Flow => {
  const {firstStepId, steps: rawSteps} = rawFlow
  const allStepsIds = rawSteps.map(step => step.id)

  if (!allStepsIds.includes(firstStepId)) {
    logger.error({firstStepId}, 'Error parsing flow configuration: cannot find first step')
    throw new Error('Error parsing flow configuration: cannot find first step')
  }

  return {firstStepId, steps: parseSteps(rawSteps, logger)}
}

// TODO check that persistAs are unique and not a reserved db keyword
// TODO check that if a step is of media type, mediaStorage configuration is present
const parseSteps = (rawSteps: RawFlow['steps'], logger: FastifyLoggerInstance): Steps => {
  const allStepsIds = rawSteps.map(step => step.id)

  return rawSteps.reduce((currSteps, currRawStep) => {
    const {id, question, nextStepId, type, persistAs} = currRawStep

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

    currSteps[id] = {
      id,
      question: question as LocalizedText,
      type,
      persistAs: persistAs || id,
      nextStepId,
    }

    return currSteps
  }, {} as Steps)
}

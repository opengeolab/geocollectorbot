import {FastifyInstance} from 'fastify'
import Composer from 'telegraf/typings/composer'
import {CallbackQuery} from 'telegraf/typings/core/types/typegram'

import {updateInteraction} from '../lib/interactionHandler'
import {composeReply} from '../lib/replyComposer'
import {DecoratedContext} from '../models/DecoratedContext'
import {StepType} from '../models/Flow'
import {MultipleChoiceStepConfig} from '../schemas/configuration/flow/stepConfig'
import {ProcessError} from '../utils/Errors'
import {parseCallbackData} from '../utils/multipleChoiceParser'

type Params = Parameters<Composer<DecoratedContext>['action']>

export const buildCallbackQueryHandler: (service: FastifyInstance) => Params[1] = service => {
  const {log: logger} = service

  return async ctx => {
    const {chatId, update, currStep} = ctx

    logger.trace({chatId, update}, `Handling new update`)

    await ctx.answerCbQuery()

    const {config, id: currStepId} = currStep
    const {type, options} = config as MultipleChoiceStepConfig

    const {callback_query: callbackQuery} = update
    const {data} = callbackQuery as CallbackQuery.DataCallbackQuery
    const {stepId, value: selectedValue} = parseCallbackData(data)

    if (type !== StepType.MULTIPLE_CHOICE) {
      logger.error({currStep, acceptedType: StepType.TEXT}, 'Wrong current step type')
      throw new ProcessError('Wrong current step type', ctx.t('errors.wrongStepType'))
    }

    if (stepId !== currStepId) {
      logger.error({currStep, stepId}, 'Steps do not match')
      throw new ProcessError('Steps do not match', ctx.t('errors.wrongStepId'))
    }

    if (!options.flat().find(({value}) => value === selectedValue)) {
      logger.error({currStep, selectedValue}, 'Selected value not among selectable options')
      throw new ProcessError('Selected value not among selectable options', ctx.t('errors.unknownOption'))
    }

    await updateInteraction(service, ctx as DecoratedContext, selectedValue)

    const replyArgs = composeReply(logger, ctx as DecoratedContext)
    await ctx.reply(...replyArgs)
  }
}

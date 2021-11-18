import {FastifyInstance} from 'fastify'
import {Update} from 'telegraf/typings/core/types/typegram'
import {CommonMessageBundle, ServiceMessageBundle} from 'typegram/message'

import {DecoratedContext} from '../models/DecoratedContext'
import {StepType} from '../models/Flow'
import {ProcessError} from '../utils/Errors'

import {updateInteraction} from './interactionHandler'
import {composeReply} from './replyComposer'

export type StepValueBuilderProps<MsgType extends ServiceMessageBundle | CommonMessageBundle> = {
  service: FastifyInstance
  message: MsgType
}

export type StepValueBuilder<MsgType extends ServiceMessageBundle | CommonMessageBundle> = (props: StepValueBuilderProps<MsgType>) => Promise<any>

export const handleIncomingMessage = async <MsgType extends ServiceMessageBundle | CommonMessageBundle>(
  service: FastifyInstance,
  ctx: DecoratedContext<Update.MessageUpdate>,
  acceptedType: StepType,
  stepValueBuilder: StepValueBuilder<MsgType>
) => {
  const {log: logger} = service
  const {chatId, message, currStep} = ctx
  const {type} = currStep

  logger.trace({chatId, message}, `Handling ${acceptedType} message`)

  // TODO handle the "wrong type" case
  if (type !== acceptedType) {
    logger.error({currStep, chatId}, 'Wrong current step type')
    throw new ProcessError('Wrong current step type', ctx.t('errors.wrongStepType'))
  }

  const stepValue = await stepValueBuilder({service, message: message as MsgType})
  await updateInteraction(service, ctx, stepValue)

  const replyArgs = composeReply(logger, ctx)
  await ctx.reply(...replyArgs)
}

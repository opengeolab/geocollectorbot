import {FastifyInstance} from 'fastify'
import {Update} from 'telegraf/typings/core/types/typegram'
import {CommonMessageBundle, ServiceMessageBundle} from 'typegram/message'

import {DecoratedContext} from '../models/DecoratedContext'
import {Step} from '../models/Flow'

import {updateInteraction} from './interactionHandler'
import {composeReply} from './replyComposer'

export type StepProps<MsgType extends ServiceMessageBundle | CommonMessageBundle> = {
  service: FastifyInstance
  ctx: DecoratedContext<Update.MessageUpdate>
  currStep: Step
  message: MsgType
}

export type StepValidator<MsgType extends ServiceMessageBundle | CommonMessageBundle> = (props: StepProps<MsgType>) => void
export type StepValueBuilder<MsgType extends ServiceMessageBundle | CommonMessageBundle> = (props: StepProps<MsgType>) => Promise<any>

export const handleIncomingMessage = async <MsgType extends ServiceMessageBundle | CommonMessageBundle>(
  service: FastifyInstance,
  ctx: DecoratedContext<Update.MessageUpdate>,
  stepValidator: StepValidator<MsgType>,
  stepValueBuilder: StepValueBuilder<MsgType>
) => {
  const {log: logger} = service
  const {chatId, message, currStep} = ctx

  logger.trace({chatId, message}, `Handling new message`)

  const stepProps: StepProps<MsgType> = {service, ctx, currStep, message: message as MsgType}

  stepValidator(stepProps)
  const stepValue = await stepValueBuilder(stepProps)
  await updateInteraction(service, ctx, stepValue)

  const replyArgs = composeReply(logger, ctx)
  await ctx.reply(...replyArgs)
}

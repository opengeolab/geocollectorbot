import {ErrorMiddlewareBuilder} from '../models/Buildes'
import {ProcessError} from '../utils/Errors'

export const buildHandleErrorMiddleware: ErrorMiddlewareBuilder = ({log: logger}) => async (error, ctx) => {
  const {update} = ctx

  if (!(error instanceof Error)) {
    logger.fatal({error, update}, 'Caught error is not an Error, exiting process')
    process.exitCode = 1
    throw new Error('Caught error is not an Error, exiting process')
  }

  if (error.name === 'TimeoutError') {
    logger.fatal({error, update}, 'Timeout error, exiting process')
    process.exitCode = 1
    throw error
  }

  if (error instanceof ProcessError) {
    logger.error({error, update}, 'Known error in process')
    await ctx.reply(error.reply)
    return
  }

  logger.error({error, update}, 'Unknown error in process')
  await ctx.reply('Something wen wrong on our hand')
}

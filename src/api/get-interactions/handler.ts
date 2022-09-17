import { RouteHandlerMethod } from 'fastify/types/route'

const handler: RouteHandlerMethod = async function (request, reply) {
  const { dataStorageClient, log, configuration: { settings } } = this
  const { includeUserInfoInGetInteractionsApi } = settings || {}

  log.debug('GET - /interactions', { shouldIncludeUserInfo: includeUserInfoInGetInteractionsApi })

  try {
    const interactions = await dataStorageClient.getAllInteractions(includeUserInfoInGetInteractionsApi)
    reply.status(200).send(interactions)
  } catch (err) {
    log.error(err, 'Error retrieving interactions')
    reply.status(500).send({
      status: 500,
      error: 'Internal Server Error',
      message: (err as Record<string, unknown>).message || 'Error retrieving interactions',
    })
  }
}

export default handler

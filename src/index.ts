import { buildService } from './setup'

buildService().then(fastify => fastify.listen(fastify.env.HTTP_PORT, '0.0.0.0'))

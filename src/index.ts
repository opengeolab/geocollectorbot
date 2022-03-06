import { buildService } from './setup'

const DEFAULT_PORT = 8080

buildService().then(fastify => fastify.listen(fastify.env.PORT || DEFAULT_PORT, '0.0.0.0'))

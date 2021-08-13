/* eslint-disable */
import fastify from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      HTTP_PORT: number
    }
  }
}

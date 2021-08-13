/* eslint-disable no-console */
import fastify from 'fastify'

const server = fastify()

server.get('/ping', async(request, reply) => {
  return 'pong\n'
})

server.listen(8000, (error, address) => {
  if (error) {
    console.error(error)
    throw error
  }

  console.log(`Server listening at ${address}`)
})

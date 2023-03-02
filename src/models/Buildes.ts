import { FastifyInstance } from 'fastify'
import { Middleware, MiddlewareFn } from 'telegraf'
import { Deunionize } from 'telegraf/src/deunionize'
import { Update } from 'telegraf/typings/core/types/typegram'
import { MaybePromise } from 'telegraf/typings/util'

import { DecoratedContext } from './DecoratedContext'

export type MiddlewareBuilder = (service: FastifyInstance) => MiddlewareFn<DecoratedContext>

export type ErrorMiddlewareBuilder = (service: FastifyInstance) => (error: unknown, ctx: DecoratedContext) => MaybePromise<void>

export type HandlerBuilder<
  U extends Deunionize<Update>,
  O extends Record<string, unknown> = {},
> = (service: FastifyInstance, options?: O) => Middleware<DecoratedContext<U>>

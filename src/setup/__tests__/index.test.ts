import * as fastify from 'fastify'
import { FastifyInstance } from 'fastify'
import { i18n as I18n } from 'i18next'
import { Telegraf } from 'telegraf'

import * as dataStorage from '../../clients/dataStorage'
import * as mediaStorage from '../../clients/mediaStorage'
import * as onFastifyClose from '../../hooks/onFastifyClose'
import { Configuration } from '../../models/Configuration'
import { DecoratedContext } from '../../models/DecoratedContext'
import * as bot from '../bot'
import * as configuration from '../configuration'
import * as i18n from '../i18n'
import { buildService } from '../index'

jest.mock('fastify', () => {
  const mockFastify = {
    decorate: jest.fn(),
    bot: { launch: jest.fn() },
    addHook: jest.fn(),
    ready: jest.fn(),
  } as unknown as FastifyInstance & PromiseLike<FastifyInstance>

  return { fastify: jest.fn().mockReturnValue(mockFastify) }
})

jest.mock('env-schema', () => ({ envSchema: jest.fn().mockReturnValue({ LOG_LEVEL: 'trace' }) }))

describe('Setup', () => {
  const mockOnFastifyCloseHandler = jest.spyOn(onFastifyClose, 'onFastifyCloseHandler')

  const mockI18n = {} as unknown as I18n
  const mockSetupInternationalization = jest.spyOn(i18n, 'setupInternationalization').mockResolvedValue(mockI18n)

  const mockConfiguration = {} as unknown as Configuration
  const mockRetrieveConfiguration = jest.spyOn(configuration, 'retrieveConfiguration').mockResolvedValue(mockConfiguration)

  const mockDataStorageClient = {} as unknown as dataStorage.DataStorageClient
  const mockBuildDataStorageClient = jest.spyOn(dataStorage, 'buildDataStorageClient').mockReturnValue(mockDataStorageClient)

  const mockMediaStorageClient = {} as unknown as mediaStorage.MediaStorageClient
  const mockBuildMediaStorageClient = jest.spyOn(mediaStorage, 'buildMediaStorageClient').mockReturnValue(mockMediaStorageClient)
  const mockRegisterGetMediaRoute = jest.spyOn(mediaStorage, 'registerGetMediaRoute')

  const mockBot = {} as unknown as Telegraf<DecoratedContext>
  const mockBuildBot = jest.spyOn(bot, 'buildBot').mockReturnValue(mockBot)

  it('should build service correctly', async () => {
    const result = await buildService()

    expect(fastify.fastify).toHaveBeenCalledTimes(1)
    expect(fastify.fastify).toHaveBeenCalledWith({ logger: { level: 'trace' } })

    expect(result.decorate).toHaveBeenCalledTimes(6)
    expect(result.decorate).toHaveBeenNthCalledWith(1, 'env', { LOG_LEVEL: 'trace' })
    expect(result.decorate).toHaveBeenNthCalledWith(2, 'i18n', mockI18n)
    expect(result.decorate).toHaveBeenNthCalledWith(3, 'configuration', mockConfiguration)
    expect(result.decorate).toHaveBeenNthCalledWith(4, 'dataStorageClient', mockDataStorageClient)
    expect(result.decorate).toHaveBeenNthCalledWith(5, 'mediaStorageClient', mockMediaStorageClient)
    expect(result.decorate).toHaveBeenNthCalledWith(6, 'bot', mockBot)

    expect(result.addHook).toHaveBeenCalledTimes(1)
    expect(result.addHook).toHaveBeenCalledWith('onClose', mockOnFastifyCloseHandler)

    // @ts-ignore
    expect(result.bot.launch).toHaveBeenCalledTimes(1)
    expect(result.ready).toHaveBeenCalledTimes(1)

    expect(mockSetupInternationalization).toHaveBeenCalledTimes(1)
    expect(mockSetupInternationalization).toHaveBeenCalledWith(result)
    expect(mockRetrieveConfiguration).toHaveBeenCalledTimes(1)
    expect(mockRetrieveConfiguration).toHaveBeenCalledWith(result)
    expect(mockBuildDataStorageClient).toHaveBeenCalledTimes(1)
    expect(mockBuildDataStorageClient).toHaveBeenCalledWith(result)
    expect(mockBuildMediaStorageClient).toHaveBeenCalledTimes(1)
    expect(mockBuildMediaStorageClient).toHaveBeenCalledWith(result)
    expect(mockRegisterGetMediaRoute).toHaveBeenCalledTimes(1)
    expect(mockRegisterGetMediaRoute).toHaveBeenCalledWith(result)
    expect(mockBuildBot).toHaveBeenCalledTimes(1)
    expect(mockBuildBot).toHaveBeenCalledWith(result)
  })
})

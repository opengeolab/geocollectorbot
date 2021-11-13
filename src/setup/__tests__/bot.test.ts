import {Telegraf} from 'telegraf'

import {baseEnv} from '../../utils/testUtils'
import {decorateBot} from '../bot'

jest.mock('telegraf', () => ({
  ...jest.requireActual('telegraf'),
  Telegraf: jest.fn(),
}))

describe('Bot', () => {
  const mockDecorate = jest.fn()
  const mockService = {env: baseEnv, decorate: mockDecorate}

  afterEach(() => jest.clearAllMocks())

  it('should decorate with bot', async () => {
    decorateBot(mockService)

    expect(Telegraf).toHaveBeenCalledTimes(1)
    expect(Telegraf).toHaveBeenCalledWith(baseEnv.TELEGRAM_AUTH_TOKEN)

    expect(mockDecorate).toHaveBeenCalledTimes(1)
    expect(mockDecorate).toHaveBeenCalledWith('bot', {})
  })
})

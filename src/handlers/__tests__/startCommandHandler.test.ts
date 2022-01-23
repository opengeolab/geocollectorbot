import { MiddlewareFn } from 'telegraf'

import { DecoratedContext } from '../../models/DecoratedContext'
import { getMockContext, getMockFastify } from '../../utils/testUtils'
import { buildStartCommandHandler } from '../startCommandHandler'

describe('Start command handler', () => {
  const mockService = getMockFastify()
  const mockCtx = getMockContext()

  afterEach(() => { jest.resetAllMocks() })

  it('should reply correctly', async () => {
    const handler = buildStartCommandHandler(mockService) as MiddlewareFn<DecoratedContext>
    await handler(mockCtx, jest.fn())

    expect(mockCtx.reply).toHaveBeenCalledTimes(1)
    expect(mockCtx.reply).toHaveBeenCalledWith('translation_commands.start', { parse_mode: 'MarkdownV2' })

    expect(mockCtx.t).toHaveBeenCalledTimes(1)
    expect(mockCtx.t).toHaveBeenCalledWith('commands.start')
  })
})

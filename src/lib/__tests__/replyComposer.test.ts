import { getMockContext, mockLogger } from '../../utils/testUtils'
import * as questionComposer from '../questionComposer'
import { composeErrorReply, composeReply } from '../replyComposer'

describe('Reply Composer', () => {
  const mockQuestionComposer = jest.fn()
  const mockGetQuestionComposerByType = jest.spyOn(questionComposer, 'getQuestionComposerByType').mockReturnValue(mockQuestionComposer)

  describe('composeReply', () => {
    it('should work is interaction is not complete', () => {
      mockQuestionComposer.mockReturnValue('question')

      const ctx = getMockContext({ nextStep: { config: { type: 'step_type' } } })

      const reply = composeReply(mockLogger, ctx)
      expect(reply).toEqual('question')

      expect(mockGetQuestionComposerByType).toHaveBeenCalledTimes(1)
      expect(mockGetQuestionComposerByType).toHaveBeenCalledWith('step_type')

      expect(mockQuestionComposer).toHaveBeenCalledTimes(1)
      expect(mockQuestionComposer).toHaveBeenCalledWith({ ctx, step: ctx.nextStep })
    })

    it('should work is interaction is complete', () => {
      mockQuestionComposer.mockReturnValue('question')

      const ctx = getMockContext()

      const reply = composeReply(mockLogger, ctx)
      expect(reply).toEqual([
        'translation_events.interactionCompleted',
        { reply_markup: { remove_keyboard: true }, parse_mode: 'MarkdownV2' },
      ])

      expect(mockGetQuestionComposerByType).toHaveBeenCalledTimes(1)
      expect(mockGetQuestionComposerByType).toHaveBeenCalledWith(undefined)

      expect(ctx.t).toHaveBeenCalledTimes(1)
      expect(ctx.t).toHaveBeenCalledWith('events.interactionCompleted')

      expect(mockQuestionComposer).toHaveBeenCalledTimes(0)
    })
  })

  describe('composeErrorReply', () => {
    it('should return reply', () => {
      const reply = composeErrorReply('text')
      expect(reply).toEqual([
        'text',
        { reply_markup: { remove_keyboard: true }, parse_mode: 'MarkdownV2' },
      ])
    })
  })
})

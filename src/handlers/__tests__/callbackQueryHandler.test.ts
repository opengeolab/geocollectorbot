import * as interactionHandler from '../../lib/interactionHandler'
import * as replyComposer from '../../lib/replyComposer'
import { StepType } from '../../models/Flow'
import { ProcessError } from '../../utils/Errors'
import * as localizer from '../../utils/localizer'
import * as multipleChoiceParser from '../../utils/multipleChoiceParser'
import { getMockContext, getMockFastify, mockLogger } from '../../utils/testUtils'
import { buildCallbackQueryHandler } from '../callbackQueryHandler'

describe('Callback query handler', () => {
  const mockParseCallbackData = jest.spyOn(multipleChoiceParser, 'parseCallbackData')
  const mockUpdateInteraction = jest.spyOn(interactionHandler, 'updateInteraction').mockResolvedValue(undefined)
  const mockComposeReply = jest.spyOn(replyComposer, 'composeReply')
  const mockResolveLocalizedText = jest.spyOn(localizer, 'resolveLocalizedText')

  const mockService = getMockFastify()

  const baseMockContext = getMockContext({
    from: { language_code: 'user_lang' },
    update: { callback_query: { data: 'callback_query_data' } },
  })

  let handler: Function
  beforeEach(() => { handler = buildCallbackQueryHandler(mockService) as unknown as Function })

  it('should throw if type is wrong', async () => {
    const currStep = { id: 'curr_step_id', config: { type: StepType.TEXT, options: [] } }

    const ctx = { ...baseMockContext, currStep }

    await expect(handler(ctx))
      .rejects
      .toEqual(new ProcessError('Wrong current step type', 'translation_errors.wrongStepType'))

    expect(baseMockContext.answerCbQuery).toHaveBeenCalledTimes(1)
    expect(baseMockContext.answerCbQuery).toHaveBeenCalledWith()

    expect(mockParseCallbackData).toHaveBeenCalledTimes(1)
    expect(mockParseCallbackData).toHaveBeenCalledWith('callback_query_data')

    expect(mockUpdateInteraction).toHaveBeenCalledTimes(0)
    expect(mockComposeReply).toHaveBeenCalledTimes(0)
    expect(mockResolveLocalizedText).toHaveBeenCalledTimes(0)
  })

  it('should throw if step id is wrong', async () => {
    mockParseCallbackData.mockReturnValue({ prefix: '', stepId: 'wrong_step_id', value: 'value' })

    const currStep = { id: 'curr_step_id', config: { type: StepType.MULTIPLE_CHOICE, options: [] } }

    const ctx = { ...baseMockContext, currStep }

    await expect(handler(ctx))
      .rejects
      .toEqual(new ProcessError('Steps do not match', 'translation_errors.unknownOption'))

    expect(baseMockContext.answerCbQuery).toHaveBeenCalledTimes(1)
    expect(baseMockContext.answerCbQuery).toHaveBeenCalledWith()

    expect(mockParseCallbackData).toHaveBeenCalledTimes(1)
    expect(mockParseCallbackData).toHaveBeenCalledWith('callback_query_data')

    expect(mockUpdateInteraction).toHaveBeenCalledTimes(0)
    expect(mockComposeReply).toHaveBeenCalledTimes(0)
    expect(mockResolveLocalizedText).toHaveBeenCalledTimes(0)
  })

  it('should throw if selected option not found', async () => {
    mockParseCallbackData.mockReturnValue({ prefix: '', stepId: 'curr_step_id', value: 'unknown_value' })

    const currStep = {
      id: 'curr_step_id',
      config: { type: StepType.MULTIPLE_CHOICE, options: [[{ text: 'option_1', value: 'option_1_value' }]] },
    }

    const ctx = { ...baseMockContext, currStep }

    await expect(handler(ctx))
      .rejects
      .toEqual(new ProcessError('Selected value not among selectable options', 'translation_errors.unknownOption'))

    expect(baseMockContext.answerCbQuery).toHaveBeenCalledTimes(1)
    expect(baseMockContext.answerCbQuery).toHaveBeenCalledWith()

    expect(mockParseCallbackData).toHaveBeenCalledTimes(1)
    expect(mockParseCallbackData).toHaveBeenCalledWith('callback_query_data')

    expect(mockUpdateInteraction).toHaveBeenCalledTimes(0)
    expect(mockComposeReply).toHaveBeenCalledTimes(0)
    expect(mockResolveLocalizedText).toHaveBeenCalledTimes(0)
  })

  it('should reply correctly', async () => {
    mockParseCallbackData.mockReturnValue({ prefix: '', stepId: 'curr_step_id', value: 'option_1_value' })
    mockResolveLocalizedText.mockReturnValue('localized_selected_text')
    mockComposeReply.mockReturnValue(['reply_arg'])

    const currStep = {
      id: 'curr_step_id',
      config: { type: StepType.MULTIPLE_CHOICE, options: [[{ text: 'option_1', value: 'option_1_value' }]] },
    }

    const ctx = { ...baseMockContext, currStep }

    await handler(ctx)

    expect(baseMockContext.answerCbQuery).toHaveBeenCalledTimes(1)
    expect(baseMockContext.answerCbQuery).toHaveBeenCalledWith()

    expect(mockParseCallbackData).toHaveBeenCalledTimes(1)
    expect(mockParseCallbackData).toHaveBeenCalledWith('callback_query_data')

    expect(mockUpdateInteraction).toHaveBeenCalledTimes(1)
    expect(mockUpdateInteraction).toHaveBeenCalledWith(mockService, ctx, 'option_1_value')

    expect(mockResolveLocalizedText).toHaveBeenCalledTimes(1)
    expect(mockResolveLocalizedText).toHaveBeenCalledWith('option_1', 'user_lang')

    expect(mockComposeReply).toHaveBeenCalledTimes(1)
    expect(mockComposeReply).toHaveBeenCalledWith(mockLogger, ctx)

    expect(baseMockContext.t).toHaveBeenCalledTimes(1)
    expect(baseMockContext.t).toHaveBeenCalledWith('events.callbackQueryOptionSelected', { selectedText: 'localized_selected_text' })

    expect(baseMockContext.reply).toHaveBeenCalledTimes(2)
    expect(baseMockContext.reply).toHaveBeenNthCalledWith(1, 'translation_events.callbackQueryOptionSelected', { parse_mode: 'MarkdownV2' })
    expect(baseMockContext.reply).toHaveBeenNthCalledWith(2, 'reply_arg')
  })

  it('should reply correctly without user lang', async () => {
    mockParseCallbackData.mockReturnValue({ prefix: '', stepId: 'curr_step_id', value: 'option_1_value' })
    mockResolveLocalizedText.mockReturnValue('localized_selected_text')
    mockComposeReply.mockReturnValue(['reply_arg'])

    const currStep = {
      id: 'curr_step_id',
      config: { type: StepType.MULTIPLE_CHOICE, options: [[{ text: 'option_1', value: 'option_1_value' }]] },
    }

    const ctx = { ...baseMockContext, from: undefined, currStep }

    await handler(ctx)

    expect(mockResolveLocalizedText).toHaveBeenCalledTimes(1)
    expect(mockResolveLocalizedText).toHaveBeenCalledWith('option_1', undefined)

    expect(baseMockContext.t).toHaveBeenCalledTimes(1)
    expect(baseMockContext.t).toHaveBeenCalledWith('events.callbackQueryOptionSelected', { selectedText: 'localized_selected_text' })
  })
})

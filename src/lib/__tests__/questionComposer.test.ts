import { Step, StepType } from '../../models/Flow'
import * as localizer from '../../utils/localizer'
import * as multipleChoiceParser from '../../utils/multipleChoiceParser'
import { getMockContext } from '../../utils/testUtils'
import { getQuestionComposerByType } from '../questionComposer'

describe('Question Composer', () => {
  const mockResolveLocalizedText = jest.spyOn(localizer, 'resolveLocalizedText').mockReturnValue('resolved_localized_text')
  const mockBuildCallbackData = jest.spyOn(multipleChoiceParser, 'buildCallbackData')

  it('should return question for unknown step type', () => {
    // @ts-ignore
    const composer = getQuestionComposerByType('unknown_type')
    expect(composer.name).toEqual('composeTextQuestion')
  })

  it('should return question for undefined step type', () => {
    const composer = getQuestionComposerByType()
    expect(composer.name).toEqual('composeTextQuestion')
  })

  it('should return question without user language', () => {
    const ctx = getMockContext()
    const step = { question: 'question' } as unknown as Step

    const composer = getQuestionComposerByType(StepType.TEXT)
    expect(composer.name).toEqual('composeTextQuestion')

    const result = composer({ ctx, step })
    expect(result).toStrictEqual([
      'resolved_localized_text',
      { reply_markup: { remove_keyboard: true }, parse_mode: 'MarkdownV2' },
    ])

    expect(mockResolveLocalizedText).toHaveBeenCalledTimes(1)
    expect(mockResolveLocalizedText).toHaveBeenCalledWith('question', undefined)
  })

  it('should return question for text step', () => {
    const ctx = getMockContext({ from: { language_code: 'language_code' } })
    const step = { question: 'question' } as unknown as Step

    const composer = getQuestionComposerByType(StepType.TEXT)
    expect(composer.name).toEqual('composeTextQuestion')

    const result = composer({ ctx, step })
    expect(result).toStrictEqual([
      'resolved_localized_text',
      { reply_markup: { remove_keyboard: true }, parse_mode: 'MarkdownV2' },
    ])

    expect(mockResolveLocalizedText).toHaveBeenCalledTimes(1)
    expect(mockResolveLocalizedText).toHaveBeenCalledWith('question', 'language_code')
  })

  it('should return question for multiple choice step', () => {
    mockBuildCallbackData
      .mockReturnValueOnce('callback_data_1')
      .mockReturnValueOnce('callback_data_2')

    const ctx = getMockContext({ from: { language_code: 'language_code' } })

    const step = {
      id: 'step_id',
      question: 'question',
      config: {
        options: [
          [{ text: 'text_1', value: 'value_1' }],
          [{ text: 'text_2', value: 'value_2' }],
        ],
      },
    } as unknown as Step

    const composer = getQuestionComposerByType(StepType.MULTIPLE_CHOICE)
    expect(composer.name).toEqual('composeMultipleChoiceQuestion')

    const result = composer({ ctx, step })
    expect(result).toStrictEqual([
      'resolved_localized_text',
      {
        reply_markup: {
          remove_keyboard: true,
          inline_keyboard: [
            [{ text: 'resolved_localized_text', callback_data: 'callback_data_1' }],
            [{ text: 'resolved_localized_text', callback_data: 'callback_data_2' }],
          ],
        },
        parse_mode: 'MarkdownV2',
      },
    ])

    expect(mockResolveLocalizedText).toHaveBeenCalledTimes(3)
    expect(mockResolveLocalizedText).toHaveBeenNthCalledWith(1, 'question', 'language_code')
    expect(mockResolveLocalizedText).toHaveBeenNthCalledWith(2, 'text_1', 'language_code')
    expect(mockResolveLocalizedText).toHaveBeenNthCalledWith(3, 'text_2', 'language_code')

    expect(mockBuildCallbackData).toHaveBeenCalledTimes(2)
    expect(mockBuildCallbackData).toHaveBeenNthCalledWith(1, 'step_id', 'value_1')
    expect(mockBuildCallbackData).toHaveBeenNthCalledWith(2, 'step_id', 'value_2')
  })

  it('should return question for multiple choice step without user language', () => {
    mockBuildCallbackData.mockReturnValue('callback_data_1')

    const ctx = getMockContext()

    const step = {
      id: 'step_id',
      question: 'question',
      config: { options: [[{ text: 'text_1', value: 'value_1' }]] },
    } as unknown as Step

    const composer = getQuestionComposerByType(StepType.MULTIPLE_CHOICE)
    expect(composer.name).toEqual('composeMultipleChoiceQuestion')

    const result = composer({ ctx, step })
    expect(result).toStrictEqual([
      'resolved_localized_text',
      {
        reply_markup: {
          remove_keyboard: true,
          inline_keyboard: [[{ text: 'resolved_localized_text', callback_data: 'callback_data_1' }]],
        },
        parse_mode: 'MarkdownV2',
      },
    ])

    expect(mockResolveLocalizedText).toHaveBeenCalledTimes(2)
    expect(mockResolveLocalizedText).toHaveBeenNthCalledWith(1, 'question', undefined)
    expect(mockResolveLocalizedText).toHaveBeenNthCalledWith(2, 'text_1', undefined)

    expect(mockBuildCallbackData).toHaveBeenCalledTimes(1)
    expect(mockBuildCallbackData).toHaveBeenNthCalledWith(1, 'step_id', 'value_1')
  })

  it('should return question for location step', () => {
    const ctx = getMockContext({ from: { language_code: 'language_code' } })
    const step = { question: 'question' } as unknown as Step

    const composer = getQuestionComposerByType(StepType.LOCATION)
    expect(composer.name).toEqual('composeLocationQuestion')

    const result = composer({ ctx, step })
    expect(result).toStrictEqual([
      'resolved_localized_text',
      {
        reply_markup: {
          remove_keyboard: true,
          one_time_keyboard: true,
          keyboard: [
            [{ text: 'translation_keyboards.location', request_location: true }],
          ],
        },
        parse_mode: 'MarkdownV2',
      },
    ])

    expect(mockResolveLocalizedText).toHaveBeenCalledTimes(1)
    expect(mockResolveLocalizedText).toHaveBeenCalledWith('question', 'language_code')

    expect(ctx.t).toHaveBeenCalledTimes(1)
    expect(ctx.t).toHaveBeenCalledWith('keyboards.location')
  })

  it('should return question for media step', () => {
    const ctx = getMockContext({ from: { language_code: 'language_code' } })
    const step = { question: 'question' } as unknown as Step

    const composer = getQuestionComposerByType(StepType.MEDIA)
    expect(composer.name).toEqual('composeMediaQuestion')

    const result = composer({ ctx, step })
    expect(result).toStrictEqual([
      'resolved_localized_text',
      { reply_markup: { remove_keyboard: true }, parse_mode: 'MarkdownV2' },
    ])

    expect(mockResolveLocalizedText).toHaveBeenCalledTimes(1)
    expect(mockResolveLocalizedText).toHaveBeenCalledWith('question', 'language_code')
  })
})

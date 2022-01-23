import {
  buildCallbackData,
  MULTIPLE_CHOICE_DATA_DIVIDER,
  MULTIPLE_CHOICE_DATA_PREFIX,
  parseCallbackData,
} from '../multipleChoiceParser'

describe('Multiple choice parser', () => {
  const finalString = `${MULTIPLE_CHOICE_DATA_PREFIX}${MULTIPLE_CHOICE_DATA_DIVIDER}step_id${MULTIPLE_CHOICE_DATA_DIVIDER}value`

  describe('buildCallbackData', () => {
    it('should return correctly', () => {
      const result = buildCallbackData('step_id', 'value')
      expect(result).toEqual(finalString)
    })
  })

  describe('parseCallbackData', () => {
    it('should return correctly', () => {
      const result = parseCallbackData(finalString)
      expect(result).toStrictEqual({
        prefix: MULTIPLE_CHOICE_DATA_PREFIX,
        stepId: 'step_id',
        value: 'value',
      })
    })
  })
})

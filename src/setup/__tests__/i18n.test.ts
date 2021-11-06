import {DEFAULT_LANGUAGE} from '../../constants'
import {decorateI18n} from '../i18n'

describe('i18n', () => {
  describe('decorateI18n', () => {
    const mockDecorate = jest.fn()
    const mockService = {decorate: mockDecorate}

    afterEach(() => jest.clearAllMocks())

    it('should decorate with i18n', async () => {
      await decorateI18n(mockService)

      expect(mockDecorate).toHaveBeenCalledTimes(1)
      expect(mockDecorate).toHaveBeenCalledWith('i18n', expect.objectContaining({language: DEFAULT_LANGUAGE}))
    })
  })
})

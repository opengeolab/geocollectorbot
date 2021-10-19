import {resolveLocalizedText} from '../localizer'

describe('Localizer', () => {
  describe('resolveLocalizedText', () => {
    it('should return localizedText if string', () => {
      const result = resolveLocalizedText('test')
      expect(result).toEqual('test')
    })

    it('should return localizedText if string with language', () => {
      const result = resolveLocalizedText('test', 'fr')
      expect(result).toEqual('test')
    })

    it('should resolve en text without language', () => {
      const result = resolveLocalizedText({en: 'test_en', it: 'test_it'})
      expect(result).toEqual('test_en')
    })

    it('should resolve en text without language', () => {
      const result = resolveLocalizedText({en: 'test_en', it: 'test_it'})
      expect(result).toEqual('test_en')
    })

    it('should resolve given language text', () => {
      const result = resolveLocalizedText({en: 'test_en', it: 'test_it'}, 'it')
      expect(result).toEqual('test_it')
    })

    it('should resolve en text if no text in given language', () => {
      const result = resolveLocalizedText({en: 'test_en', it: 'test_it'}, 'fr')
      expect(result).toEqual('test_en')
    })
  })
})

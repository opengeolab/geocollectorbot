import { join } from 'path'

import { DEFAULT_LANGUAGE } from '../../utils/constants'
import { getMockFastify } from '../../utils/testUtils'
import { setupInternationalization } from '../i18n'

describe('i18n', () => {
  describe('setupInternationalization', () => {
    it('should use custom translation folder', async () => {
      const mockService = getMockFastify({ env: { CUSTOM_TRANSLATIONS_FOLDER_PATH: 'custom_translation_folder_path' } })

      const result = await setupInternationalization(mockService)

      expect(result.options.fallbackLng).toEqual([DEFAULT_LANGUAGE])
      // @ts-ignore
      expect(result.options.backend.loadPath).toEqual('custom_translation_folder_path/{{lng}}.yaml')
    })

    it('should use default translation folder', async () => {
      const mockService = getMockFastify({ env: {} })

      const result = await setupInternationalization(mockService)

      expect(result.options.fallbackLng).toEqual([DEFAULT_LANGUAGE])
      // @ts-ignore
      expect(result.options.backend.loadPath).toEqual(`${join(__dirname, '../../locales')}/{{lng}}.yaml`)
    })
  })
})

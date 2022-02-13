import { join } from 'path'

import { DEFAULT_LANGUAGE } from '../../utils/constants'
import { getMockFastify } from '../../utils/testUtils'
import { setupInternationalization } from '../i18n'

describe('i18n', () => {
  describe('setupInternationalization', () => {
    it('should use custom translation folder', async () => {
      const path = join(__dirname, '/mocks/custom_translations')
      const mockService = getMockFastify({ env: { CUSTOM_TRANSLATIONS_FOLDER_PATH: path } })

      const result = await setupInternationalization(mockService)

      expect(result.options.fallbackLng).toEqual([DEFAULT_LANGUAGE])
      // @ts-ignore
      expect(result.options.backend.loadPath).toEqual(`${path}/{{lng}}.yaml`)
    })

    it('should use default translation folder if no custom path provided', async () => {
      const mockService = getMockFastify({ env: {} })

      const result = await setupInternationalization(mockService)

      expect(result.options.fallbackLng).toEqual([DEFAULT_LANGUAGE])
      // @ts-ignore
      expect(result.options.backend.loadPath).toEqual(`${join(__dirname, '../../locales')}/{{lng}}.yaml`)
    })

    it('should use default translation folder if not existing custom path provided', async () => {
      const path = join(__dirname, '/not_existing_folder')
      const mockService = getMockFastify({ env: { CUSTOM_TRANSLATIONS_FOLDER_PATH: path } })

      const result = await setupInternationalization(mockService)

      expect(result.options.fallbackLng).toEqual([DEFAULT_LANGUAGE])
      // @ts-ignore
      expect(result.options.backend.loadPath).toEqual(`${join(__dirname, '../../locales')}/{{lng}}.yaml`)
    })
  })
})

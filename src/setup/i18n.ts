import fs from 'fs/promises'
import { join } from 'path'

import { FastifyInstance } from 'fastify'
import i18next, { i18n } from 'i18next'
import i18nextBackend from 'i18next-fs-backend'

import { DEFAULT_LANGUAGE } from '../utils/constants'

const localesFolder = join(__dirname, '../locales')

export const setupInternationalization = async (service: FastifyInstance): Promise<i18n> => {
  const { env: { CUSTOM_TRANSLATIONS_FOLDER_PATH }, log: logger } = service

  let baseTranslationsFolderPath: string
  try {
    await fs.stat(CUSTOM_TRANSLATIONS_FOLDER_PATH || '')
    logger.debug({ CUSTOM_TRANSLATIONS_FOLDER_PATH }, 'Custom translations folder found')
    baseTranslationsFolderPath = CUSTOM_TRANSLATIONS_FOLDER_PATH as string
  } catch (err) {
    logger.debug({ CUSTOM_TRANSLATIONS_FOLDER_PATH }, 'Custom translations folder not found')
    baseTranslationsFolderPath = localesFolder
  }

  await i18next
    .use(i18nextBackend)
    .init({
      fallbackLng: DEFAULT_LANGUAGE,
      initImmediate: false,
      backend: { loadPath: join(baseTranslationsFolderPath as string, '{{lng}}.yaml') },
    })

  return i18next
}

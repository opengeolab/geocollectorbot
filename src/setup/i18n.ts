import {join} from 'path'

import {FastifyInstance} from 'fastify'
import i18next from 'i18next'
import i18nextBackend from 'i18next-fs-backend'

import {DEFAULT_LANGUAGE} from '../constants'

const localesFolder = join(__dirname, '../locales')

export const decorateI18n = async (service: Pick<FastifyInstance, 'decorate'>) => {
  await i18next
    .use(i18nextBackend)
    .init({
      debug: true,
      fallbackLng: DEFAULT_LANGUAGE,
      initImmediate: false,
      backend: {loadPath: join(localesFolder, '{{lng}}/{{ns}}.json')},
    })

  service.decorate('i18n', i18next)
}

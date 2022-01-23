import { LocalizedText } from '../schemas/localizedText'

import { DEFAULT_LANGUAGE } from './constants'

export const resolveLocalizedText = (localizedText: LocalizedText, language = DEFAULT_LANGUAGE): string => {
  return typeof localizedText === 'string' ? localizedText : (localizedText[language] || localizedText[DEFAULT_LANGUAGE])
}

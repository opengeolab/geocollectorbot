import {DEFAULT_LANGUAGE} from '../constants'
import {LocalizedText} from '../schemas/localizedText'

export const resolveLocalizedText = (localizedText: LocalizedText, language = DEFAULT_LANGUAGE): string => {
  return typeof localizedText === 'string' ? localizedText : (localizedText[language] || localizedText[DEFAULT_LANGUAGE])
}

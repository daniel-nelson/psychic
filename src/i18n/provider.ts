import I18nDefaultLocales from './conf/I18nDefaultLocales.js'
import { DottedLanguageObjectStringPaths, GenericI18nObject } from './conf/types.js'

const SUPPORTED_LOCALES = ['en-US']
export function supportedLocales() {
  return SUPPORTED_LOCALES
}

class TranslationMissing extends Error {}

export default class I18nProvider {
  /**
   * Leverages the arguments provided to return to you an
   * i18n function, which will provide type completion based
   * on the locales set up in your application.
   *
   * @param allLocales - the list of all locales in your app. something like `{ en: { ... }, ['en-UK']: { ... }, es: { ... }, ... }`
   * @param singleLocaleKey - the key from the allLocales object that you want to use as your type base. i.e. 'en'
   * */
  public static provide<
    const AllLocales,
    const SingleLocaleKey extends keyof AllLocales & string,
    LocalesEnum extends string = (typeof I18nDefaultLocales)[number],
    SingleLocaleShape = AllLocales[SingleLocaleKey],
    // singleLocale is only captured so the generic can be manufactured from it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  >(allLocales: AllLocales, singleLocaleKey: SingleLocaleKey) {
    return function i18n(
      locale: LocalesEnum,
      i18nPathString: DottedLanguageObjectStringPaths<SingleLocaleShape> & string,
      interpolations?: Record<string, string | number>,
    ): string {
      const language = locale?.split('-')?.[0]
      const i18nPath = i18nPathString.split('.')
      const localeI18nObject: GenericI18nObject = (allLocales[language as keyof typeof allLocales] ||
        allLocales['en' as keyof typeof allLocales]) as GenericI18nObject

      try {
        return applyInterpolations(i18nPathString, _i18n(localeI18nObject, i18nPath), interpolations)
      } catch (err) {
        const error: Error = err as Error
        if (error.constructor === TranslationMissing) return i18nPathString
        throw error
      }
    }
  }
}

function applyInterpolations(
  i18nPathString: string,
  str: string,
  interpolations?: Record<string, string | number>,
) {
  if (!interpolations) return str

  Object.keys(interpolations).forEach(key => {
    const interpolationValue = interpolations[key]
    if (interpolationValue === undefined) throw new I18nInterpolationReceivedUndefined(i18nPathString, key)
    if (interpolationValue === null) throw new I18nInterpolationReceivedNull(i18nPathString, key)

    const replacement: string = interpolationValue.toString()
    str = str.replace(`%{${key}}`, replacement)
  })

  return str
}

function _i18n(i18nHash: GenericI18nObject, i18nPath: string[]): string {
  const index = i18nPath[0]
  if (index === undefined) throw new TranslationMissing()

  const translation: string | GenericI18nObject | undefined = i18nHash[index]
  if (translation === undefined) throw new TranslationMissing()

  if (typeof translation === 'string') return translation
  return _i18n(translation, i18nPath.slice(1))
}

class I18nInterpolationError extends Error {
  constructor(
    private valueType: string,
    private i18nPathString: string,
    private interpolationKey: string,
  ) {
    super()
    Object.setPrototypeOf(this, new.target.prototype)
  }

  public override get message() {
    return `\n${this.valueType} interpolation value received:\ni18n path string: ${this.i18nPathString}\ninterpolationKey: ${this.interpolationKey}\n    `
  }
}

export class I18nInterpolationReceivedUndefined extends I18nInterpolationError {
  constructor(i18nPathString: string, interpolationKey: string) {
    super('undefined', i18nPathString, interpolationKey)
  }
}

export class I18nInterpolationReceivedNull extends I18nInterpolationError {
  constructor(i18nPathString: string, interpolationKey: string) {
    super('null', i18nPathString, interpolationKey)
  }
}

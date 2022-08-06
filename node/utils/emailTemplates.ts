import type { TemplateFriendlyName, TemplateName } from '../typings/mailClient'

/**
 *
 * @param name Template name (omit the prefix - oms-return-request-)
 * @param locale Locale (defaults to 'en-GB')
 * @returns {String} Template name
 */
export const templateName = (name: TemplateName, locale: string): string =>
  `oms-return-request-${name}_${locale}`

/**
 *
 * @param { String } name Template friendly name (omit the prefix - [OMS] Return Request)
 * @param { String } locale Locale (defaults to 'en-GB')
 * @returns { String } Template friendly name
 */
export const templateFriendlyName = (
  name: TemplateFriendlyName,
  locale: string
): string => `[OMS] Return Request ${name} (${locale})`

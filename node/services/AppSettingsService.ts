import type {
  ReturnAppSettings,
  MutationSaveReturnAppSettingsArgs,
} from 'vtex.return-app'

import { SETTINGS_PATH } from '../utils/constants'
import {
  validateMaxDaysCustomReasons,
  validatePaymentOptions,
  valideteUniqueCustomReasonsPerLocale,
} from '../utils/appSettingsValidation'

export async function saveAppSettingService(
  ctx: Context,
  args: MutationSaveReturnAppSettingsArgs
): Promise<any> {
  const {
    clients: { appSettings },
  } = ctx

  const { settings } = args ?? {}
  const { maxDays, customReturnReasons, paymentOptions } = settings ?? {}

  // validate if all custom reasons have max days smaller than the general max days
  validateMaxDaysCustomReasons(maxDays, customReturnReasons)

  // validate if all custom reasons have unique locales for their translations
  valideteUniqueCustomReasonsPerLocale(customReturnReasons)

  const currentSettings = {
    ...settings,
    // validate that there is at least one payment method selected or user has to use the same as in the order
    paymentOptions: validatePaymentOptions(paymentOptions),
  }

  await appSettings.save(SETTINGS_PATH, currentSettings)

  return true
}

export async function returnAppSettingService(
  ctx: Context
): Promise<ReturnAppSettings | null> {
  const {
    clients: { appSettings },
  } = ctx

  const settings = await appSettings.get(SETTINGS_PATH, true)

  if (!settings) return null

  return settings
}

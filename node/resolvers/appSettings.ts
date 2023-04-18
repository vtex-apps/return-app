import type { ReturnAppSettings, MutationSaveReturnAppSettingsArgs } from '../../typings/ReturnAppSettings'

import {
  validateMaxDaysCustomReasons,
  validatePaymentOptions,
  valideteUniqueCustomReasonsPerLocale,
} from '../utils/appSettingsValidation'
import { SETTINGS_PATH } from '../utils/constants'

const returnAppSettings = async (
  _root: unknown,
  _args: unknown,
  ctx: Context
): Promise<ReturnAppSettings | null> => {
  const {
    clients: { appSettings },
  } = ctx

  const settings = await appSettings.get(SETTINGS_PATH, true)

  if (!settings) return null

  return settings
}

const saveReturnAppSettings = async (
  _root: unknown,
  args: MutationSaveReturnAppSettingsArgs,
  ctx: Context
) => {
  const {
    clients: { appSettings },
  } = ctx

  // validate if all custom reasons have max days smaller than the general max days
  validateMaxDaysCustomReasons(
    args.settings.maxDays,
    args.settings.customReturnReasons
  )

  // validate if all custom reasons have unique locales for their translations
  valideteUniqueCustomReasonsPerLocale(args.settings.customReturnReasons)

  const settings = {
    ...args.settings,
    // validate that there is at least one payment method selected or user has to use the same as in the order
    paymentOptions: validatePaymentOptions(args.settings.paymentOptions),
  }

  await appSettings.save(SETTINGS_PATH, settings)

  return true
}

export const queries = { returnAppSettings }
export const mutations = { saveReturnAppSettings }

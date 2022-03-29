import type {
  ReturnAppSettings,
  MutationSaveReturnAppSettingsArgs,
} from 'vtex.return-app'

import {
  validateMaxDaysCustomReasons,
  validatePaymentOptions,
  valideteUniqueCustomReasonsPerLocale,
} from '../utils/appSettingsValidation'

const SETTINGS_PATH = 'app-settings'

const returnAppSettings = (
  _root: unknown,
  _args: unknown,
  ctx: Context
): Promise<ReturnAppSettings | null> => {
  const {
    clients: { appSettings },
  } = ctx

  return appSettings.get(SETTINGS_PATH, true)
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
    args.settings.customReturnReasons ?? []
  )

  // validate if all custom reasons have unique locales for their translations
  valideteUniqueCustomReasonsPerLocale(args.settings.customReturnReasons)

  // validate that there is at least one payment method selected or user has to use the same as in the order
  validatePaymentOptions(args.settings.paymentOptions)

  await appSettings.save(SETTINGS_PATH, args.settings)

  return true
}

export const queries = { returnAppSettings }
export const mutations = { saveReturnAppSettings }

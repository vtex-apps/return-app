import type {
  ReturnAppSettings,
  MutationSaveReturnAppSettingsArgs,
} from 'vtex.return-app'

import {
  validateMaxDaysCustomReasons,
  validatePaymentOptions,
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

  if (
    !validateMaxDaysCustomReasons(
      args.settings.maxDays,
      args.settings.customReturnReasons ?? []
    )
  ) {
    throw new Error(
      'A custom reason cannot have a max days greater than the general max days'
    )
  }

  // validate that there is at least one payment method selected or user has to use the same as in the order
  if (!validatePaymentOptions(args.settings.paymentOptions)) {
    throw new Error('At least one payment method must be selected')
  }

  await appSettings.save(SETTINGS_PATH, args.settings)

  return true
}

export const queries = { returnAppSettings }
export const mutations = { saveReturnAppSettings }

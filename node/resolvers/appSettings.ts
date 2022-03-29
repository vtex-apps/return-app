import type {
  ReturnAppSettings,
  MutationSaveReturnAppSettingsArgs,
  PaymentOptions,
  PaymentType,
} from 'vtex.return-app'

const SETTINGS_PATH = 'app-settings'

const validatePaymentOptions = (paymentOptions: PaymentOptions) => {
  const { enablePaymentMethodSelection, allowedPaymentTypes } = paymentOptions

  // If the user has not enabled the payment method selection, then the allowed payment types can be all unselected.
  if (!enablePaymentMethodSelection) return true

  let result = false

  for (const paymentType of Object.keys(allowedPaymentTypes)) {
    // If we have at least one payment method selected, then the payment options are valid.
    if (allowedPaymentTypes[paymentType as keyof PaymentType]) {
      result = true
      break
    }
  }

  return result
}

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

  // validate that there is at least one payment method selected or user has to use the same as in the order
  if (!validatePaymentOptions(args.settings.paymentOptions)) {
    throw new Error('At least one payment method must be selected')
  }

  await appSettings.save(SETTINGS_PATH, args.settings)

  return true
}

export const queries = { returnAppSettings }
export const mutations = { saveReturnAppSettings }

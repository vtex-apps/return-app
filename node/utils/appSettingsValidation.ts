import type {
  PaymentOptionsInput,
  PaymentTypeInput,
  CustomReturnReasonInput,
  PaymentOptions,
} from '../../typings/ReturnAppSettings'

export const validatePaymentOptions = (
  paymentOptions: PaymentOptionsInput
): PaymentOptions => {
  const {
    enablePaymentMethodSelection,
    allowedPaymentTypes,
    automaticallyRefundPaymentMethod,
  } = paymentOptions

  // If the user has not enabled the payment method selection, then the allowed payment types can be any available. The automaticallyRefundPaymentMethod needs to have a value.
  if (!enablePaymentMethodSelection) {
    if (typeof automaticallyRefundPaymentMethod !== 'boolean') {
      throw new Error(
        'When payment method selection is disabled, the automaticallyRefundPaymentMethod needs to be a boolean'
      )
    }

    return paymentOptions
  }

  // Make automaticallyRefundPaymentMethod null when enablePaymentMethodSelection is true. This way we avoid confusion. We cannot have this value as true when payment method selection is eneble.
  const adjustedPaymentOptions = {
    ...paymentOptions,
    automaticallyRefundPaymentMethod: false,
  }

  for (const paymentType of Object.keys(allowedPaymentTypes)) {
    // If we have at least one payment method selected, then the payment options are valid.
    if (allowedPaymentTypes[paymentType as keyof PaymentTypeInput]) {
      return adjustedPaymentOptions
    }
  }

  // if we got here, all the alloed payment types are unselected.
  throw new Error('At least one payment method must be selected')
}

export const validateMaxDaysCustomReasons = (
  maxDays: number,
  customReturnReasons: CustomReturnReasonInput[] | undefined | null
) => {
  if (!customReturnReasons) return

  if (customReturnReasons.length === 0) return

  const maxCustomOptionsDays = customReturnReasons.reduce(
    (maxDay, option) => (maxDay > option.maxDays ? maxDay : option.maxDays),
    0
  )

  if (maxCustomOptionsDays && maxCustomOptionsDays < maxDays) {
    throw new Error(
      `No custom reason found having max days equal or greater than the general max days of ${maxDays}`
    )
  }

  for (const customReason of customReturnReasons) {
    if (customReason.maxDays > maxDays) {
      throw new Error(
        `Custom reason ${customReason.reason} cannot have a max days (${customReason.maxDays}) greater than the general max days ${maxDays}`
      )
    }
  }
}

export const valideteUniqueCustomReasonsPerLocale = (
  customReturnReasons: CustomReturnReasonInput[] | undefined | null
) => {
  if (!customReturnReasons) return

  if (customReturnReasons.length === 0) return

  for (const customReturn of customReturnReasons) {
    const { translations } = customReturn

    if (!translations) continue

    const uniqueLocales = new Set()

    for (const translation of translations) {
      if (uniqueLocales.has(translation.locale)) {
        throw new Error(
          `Reason ${customReturn.reason} has duplicate translation for locale ${translation.locale}`
        )
      }

      uniqueLocales.add(translation.locale)
    }
  }
}

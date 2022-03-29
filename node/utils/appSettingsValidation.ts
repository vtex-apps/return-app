import type {
  PaymentOptionsInput,
  PaymentTypeInput,
  CustomReturnReasonInput,
} from 'vtex.return-app'

export const validatePaymentOptions = (paymentOptions: PaymentOptionsInput) => {
  const { enablePaymentMethodSelection, allowedPaymentTypes } = paymentOptions

  // If the user has not enabled the payment method selection, then the allowed payment types can be all unselected.
  if (!enablePaymentMethodSelection) return

  for (const paymentType of Object.keys(allowedPaymentTypes)) {
    // If we have at least one payment method selected, then the payment options are valid.
    if (allowedPaymentTypes[paymentType as keyof PaymentTypeInput]) return
  }

  // if we got here, all the alloed payment types are unselected.
  throw new Error('At least one payment method must be selected')
}

export const validateMaxDaysCustomReasons = (
  maxDays: number,
  customReasons: CustomReturnReasonInput[]
) => {
  for (const customReason of customReasons) {
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

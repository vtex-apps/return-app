import type {
  PaymentOptionsInput,
  PaymentTypeInput,
  CustomReturnReasonInput,
} from 'vtex.return-app'

export const validatePaymentOptions = (paymentOptions: PaymentOptionsInput) => {
  const { enablePaymentMethodSelection, allowedPaymentTypes } = paymentOptions

  // If the user has not enabled the payment method selection, then the allowed payment types can be all unselected.
  if (!enablePaymentMethodSelection) return true

  let result = false

  for (const paymentType of Object.keys(allowedPaymentTypes)) {
    // If we have at least one payment method selected, then the payment options are valid.
    if (allowedPaymentTypes[paymentType as keyof PaymentTypeInput]) {
      result = true
      break
    }
  }

  return result
}

export const validateMaxDaysCustomReasons = (
  maxDays: number,
  customReasons: CustomReturnReasonInput[]
) => {
  let result = true

  for (const customReason of customReasons) {
    if (customReason.maxDays > maxDays) {
      result = false
      break
    }
  }

  return result
}

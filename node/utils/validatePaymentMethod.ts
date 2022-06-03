import type { RefundPaymentDataInput, PaymentOptions } from 'vtex.return-app'
import { ResolverError } from '@vtex/api'

export const validatePaymentMethod = (
  refundPaymentMethodRequest: RefundPaymentDataInput,
  paymentSettings: PaymentOptions
) => {
  const { enablePaymentMethodSelection, allowedPaymentTypes } = paymentSettings
  const { refundPaymentMethod, iban, accountHolderName } =
    refundPaymentMethodRequest

  // When admin doesn't allow selection, PM request has to be sameAsPurchase
  if (
    !enablePaymentMethodSelection &&
    refundPaymentMethod !== 'sameAsPurchase'
  ) {
    throw new ResolverError('Payment method selection is not allowed', 400)
  }

  // sameAsPurchase isn't a field on allowedPaymentTypes. Return here to satisfy TS.
  if (refundPaymentMethod === 'sameAsPurchase') return

  // The PM in the request has to be true in the allowedPaymentTypes on the settings.
  if (!allowedPaymentTypes[refundPaymentMethod]) {
    throw new ResolverError(
      `Payment method ${refundPaymentMethod} is not allowed`,
      400
    )
  }

  if (refundPaymentMethod === 'bank') {
    if (!iban) {
      throw new ResolverError('IBAN is required', 400)
    }

    if (!accountHolderName) {
      throw new ResolverError('Account holder name is required', 400)
    }
  }
}

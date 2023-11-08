import { ResolverError } from '@vtex/api'

import type { PaymentOptions } from '../../typings/ReturnAppSettings'
import type { RefundPaymentDataInput } from '../../typings/ReturnRequest'
import { isValidIBANNumber } from './isValidIBANNumber'

export const validatePaymentMethod = (
  refundPaymentData: RefundPaymentDataInput,
  paymentSettings: PaymentOptions
) => {
  const {
    enablePaymentMethodSelection,
    allowedPaymentTypes,
    automaticallyRefundPaymentMethod,
  } = paymentSettings

  const { refundPaymentMethod, iban, accountHolderName } = refundPaymentData

  // When admin doesn't allow selection, PM request has to be sameAsPurchase
  if (
    !enablePaymentMethodSelection &&
    refundPaymentMethod !== 'sameAsPurchase'
  ) {
    throw new ResolverError(
      `Payment method ${refundPaymentMethod} is not allowed`,
      400
    )
  }

  if (refundPaymentMethod === 'sameAsPurchase') {
    if (typeof automaticallyRefundPaymentMethod !== 'boolean') {
      throw new ResolverError(
        `automaticallyRefundPaymentMethod field isn't set on settings. It has to be a boolean when refundPaymentMethod is sameAsPurchase`,
        500
      )
    }

    // sameAsPurchase isn't a field on allowedPaymentTypes. Return here to satisfy TS.
    return
  }

  // The PM in the request has to be true in the allowedPaymentTypes on the settings.
  if (!allowedPaymentTypes[refundPaymentMethod]) {
    throw new ResolverError(
      `Payment method ${refundPaymentMethod} is not allowed`,
      400
    )
  }

  // eslint-disable-next-line vtex/prefer-early-return
  if (refundPaymentMethod === 'bank') {
    if (!iban) {
      throw new ResolverError('IBAN is required', 400)
    }

    if (!accountHolderName) {
      throw new ResolverError('Account holder name is required', 400)
    }

    if (!isValidIBANNumber(iban)) {
      throw new ResolverError('IBAN is not valid', 400)
    }
  }
}

import type {
  ReturnRequestItemInput,
  ReturnRequestInput,
} from '../../../typings/ReturnRequest'
import type { OrderDetailsState } from '../provider/OrderToReturnReducer'
import { isValidIBANNumber } from './isValidIBANNumber'

const hasValidReasonOrCondition = (
  item: OrderDetailsState['items'][number],
  considerItemCondition: boolean
): boolean => {
  const isOtherReason = item.returnReason?.reason === 'otherReason'
  const hasRequiredUserInput = isOtherReason
    ? Boolean(item.returnReason?.otherReason)
    : true

  const validReason = Boolean(item.returnReason) && hasRequiredUserInput

  if (considerItemCondition) {
    return Boolean(item.condition) && validReason
  }

  return validReason
}

export type ErrorsValidation =
  | 'terms-and-conditions'
  | 'no-item-selected'
  | 'reason-or-condition'
  | 'customer-data'
  | 'pickup-data'
  | 'refund-payment-data'
  | 'bank-details'

interface ValidationError {
  errors: ErrorsValidation[]
  validatedFields?: never
}

interface ValidationSuccess {
  errors?: never
  validatedFields: ReturnRequestInput
}
interface ValidationData {
  termsAndConditionsAccepted: boolean
  locale: string
  // If the item condition should be considered along the return reason
  considerItemCondition: boolean
}

export const validateNewReturnRequestFields = (
  returnRequest: OrderDetailsState,
  validationData: ValidationData
): ValidationError | ValidationSuccess => {
  const { items, pickupReturnData, customerProfileData, refundPaymentData } =
    returnRequest

  const { termsAndConditionsAccepted, locale, considerItemCondition } =
    validationData

  const errors: ErrorsValidation[] = []

  if (!termsAndConditionsAccepted) {
    errors.push('terms-and-conditions')

    // return the error on checkbox to make sure this error is the only one when happening
    return { errors }
  }

  const itemsToReturn = items.filter((item) => item.quantity > 0)

  if (itemsToReturn.length === 0) {
    errors.push('no-item-selected')
  }

  const validatedItems = itemsToReturn.filter((item) =>
    hasValidReasonOrCondition(item, considerItemCondition)
  ) as ReturnRequestItemInput[]

  if (itemsToReturn.length !== validatedItems.length) {
    errors.push('reason-or-condition')
  }

  for (const field of Object.keys(customerProfileData)) {
    if (!customerProfileData[field]) {
      errors.push('customer-data')
    }
  }

  for (const field of Object.keys(pickupReturnData)) {
    if (!pickupReturnData[field] && field !== 'state') {
      errors.push('pickup-data')
    }
  }

  const { refundPaymentMethod } = refundPaymentData ?? {}

  if (!refundPaymentData || !refundPaymentMethod) {
    errors.push('refund-payment-data')

    return { errors }
  }

  if (refundPaymentMethod === 'bank') {
    const { iban, accountHolderName } = refundPaymentData

    if (!iban || !accountHolderName || !isValidIBANNumber(iban)) {
      errors.push('bank-details')
    }
  }

  if (!pickupReturnData.addressType) {
    /**
     * This is an app error, not a user one.
     * Tracking it here so we can notify dev AND validate it for TS. This is why the logic has to be the last one.
     */
    console.error('Missing address type')

    // We return here to satisfy TS condition for addressType check
    return { errors }
  }

  if (errors.length) {
    return { errors }
  }

  const { addressType } = pickupReturnData

  const validatedFields: ReturnRequestInput = {
    ...returnRequest,
    items: validatedItems,
    pickupReturnData: { ...pickupReturnData, addressType },
    refundPaymentData,
    locale,
  }

  return { validatedFields }
}

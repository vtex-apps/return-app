import type { OrderToReturnValidation } from '../../typings/OrderToReturn'

import type {
  ReturnRequestConfirmation,
  ReturnRequestStatusUpdate,
} from '../typings/mailClient'

export const SETTINGS_PATH = 'app-settings'
export const STATUS_INVOICED = 'invoiced'
export const STATUS_PAYMENT_APPROVE = 'payment-approved'

export const ORDER_TO_RETURN_VALIDATON: Record<
  OrderToReturnValidation,
  OrderToReturnValidation
> = {
  OUT_OF_MAX_DAYS: 'OUT_OF_MAX_DAYS',
  ORDER_NOT_INVOICED: 'ORDER_NOT_INVOICED',
}

export const OMS_RETURN_REQUEST_CONFIRMATION = (
  locale = 'en-GB'
): ReturnRequestConfirmation => `oms-return-request-confirmation_${locale}`
export const OMS_RETURN_REQUEST_CONFIRMATION_FRIENDLY_NAME = (
  locale = 'en-GB'
) => `[OMS] Return Request Confirmation_${locale}`

export const OMS_RETURN_REQUEST_STATUS_UPDATE = (
  locale = 'en-GB'
): ReturnRequestStatusUpdate => `oms-return-request-status-update_${locale}`
export const OMS_RETURN_REQUEST_STATUS_UPDATE_FRIENDLY_NAME = (
  locale = 'en-GB'
) => `[OMS] Return Request Status Update_${locale}`

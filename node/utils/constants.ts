import type { OrderToReturnValidation } from 'vtex.return-app'

export const SETTINGS_PATH = 'app-settings'

export const ORDER_TO_RETURN_VALIDATON: Record<
  OrderToReturnValidation,
  OrderToReturnValidation
> = {
  OUT_OF_MAX_DAYS: 'OUT_OF_MAX_DAYS',
  ORDER_NOT_INVOICED: 'ORDER_NOT_INVOICED',
}

export const OMS_RETURN_REQUEST_CONFIRMATION = (locale: string) =>
  `oms-return-request-confirmation-${locale}`
export const OMS_RETURN_REQUEST_CONFIRMATION_FRIENDLY_NAME = (locale: string) =>
  `[OMS] Return Request Confirmation-${locale}`

export const OMS_RETURN_REQUEST_STATUS_UPDATE = (locale: string) =>
  `oms-return-request-status-update_${locale}`
export const OMS_RETURN_REQUEST_STATUS_UPDATE_FRIENDLY_NAME = (
  locale: string
) => `[OMS] Return Request Status Update_${locale}`

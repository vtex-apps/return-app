import type { OrderToReturnValidation } from 'vtex.return-app'

export const SETTINGS_PATH = 'app-settings'

export const ORDER_TO_RETURN_VALIDATON: Record<
  OrderToReturnValidation,
  OrderToReturnValidation
> = {
  OUT_OF_MAX_DAYS: 'OUT_OF_MAX_DAYS',
  ORDER_NOT_INVOICED: 'ORDER_NOT_INVOICED',
}

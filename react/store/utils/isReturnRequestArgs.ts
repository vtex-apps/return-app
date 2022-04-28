import type { ReturnRequestInput } from 'vtex.return-app'

import type { OrderDetailsState } from '../provider/OrderToReturnReducer'

/**
 * Validates if the return request on state is valid as the argument for the mutation to create a return request.
 * It checks all fields made optional using PartialBy in the OrderDetailsState.
 */
export const isReturnRequestArgs = (
  returnRequest: OrderDetailsState
): returnRequest is ReturnRequestInput => {
  const { items, pickupReturnData } = returnRequest

  const itemsToReturn = items.filter((item) => item.quantity > 0)

  const haveReasonAndCondition = itemsToReturn.every(
    (item) => item.condition && item.returnReason
  )

  if (!haveReasonAndCondition) return false

  const hasAddressType = Boolean(pickupReturnData.addressType)

  if (!hasAddressType) return false

  return true
}

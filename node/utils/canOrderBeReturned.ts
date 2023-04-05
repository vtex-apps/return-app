import { ResolverError } from '@vtex/api'

import { isWithinMaxDaysToReturn } from './dateHelpers'
import { ORDER_TO_RETURN_VALIDATON, STATUS_INVOICED } from './constants'

const { ORDER_NOT_INVOICED, OUT_OF_MAX_DAYS } = ORDER_TO_RETURN_VALIDATON

export const canOrderBeReturned = ({
  creationDate,
  maxDays,
  status,
  enableStatusSelection
}: {
  creationDate: string
  maxDays: number
  status: string
  enableStatusSelection:boolean
}) => {
  if (!isWithinMaxDaysToReturn(creationDate, maxDays)) {
    throw new ResolverError(
      'Order is not within max days to return',
      400,
      OUT_OF_MAX_DAYS
    )
  }

  if (enableStatusSelection && status !== STATUS_INVOICED) {

    throw new ResolverError('Order is not invoiced', 400, ORDER_NOT_INVOICED)
  }
}

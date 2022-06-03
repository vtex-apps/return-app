import { ResolverError } from '@vtex/api'

import { isWithinMaxDaysToReturn } from './dateHelpers'
import { ORDER_TO_RETURN_VALIDATON } from './constants'

const { ORDER_NOT_INVOICED, OUT_OF_MAX_DAYS } = ORDER_TO_RETURN_VALIDATON

export const canOrderBeReturned = ({
  creationDate,
  maxDays,
  status,
}: {
  creationDate: string
  maxDays: number
  status: string
}) => {
  if (!isWithinMaxDaysToReturn(creationDate, maxDays)) {
    throw new ResolverError(
      'Order is not within max days to return',
      400,
      OUT_OF_MAX_DAYS
    )
  }

  if (status !== 'invoiced') {
    throw new ResolverError('Order is not invoiced', 400, ORDER_NOT_INVOICED)
  }
}

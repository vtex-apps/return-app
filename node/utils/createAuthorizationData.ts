import { UserInputError } from '@vtex/api'
import type { AdjustmentNote } from 'vtex.return-app'

export const createAdjustmentAuthorizationData = ({
  requestAmount,
  authorizedAmount,
}: {
  requestAmount: number
  authorizedAmount: number
}): AdjustmentNote['authorizationData'] => {
  if (requestAmount < authorizedAmount) {
    throw new UserInputError(
      `Requested value (${requestAmount}) is less than the authorized value sent (${authorizedAmount})`
    )
  }

  return {
    authorizedAmount,
  }
}

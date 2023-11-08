import { ResolverError, UserInputError } from '@vtex/api'

import type { PickupReturnDataInput } from '../../typings/ReturnRequest'

export const validateCanUsedropoffPoints = (
  pickupReturnData: PickupReturnDataInput,
  isPickupPointsEnabled?: boolean | null
) => {
  if (!pickupReturnData) {
    throw new UserInputError('Missing pickupReturnData')
  }

  const { addressType } = pickupReturnData

  if (addressType === 'PICKUP_POINT' && !isPickupPointsEnabled) {
    throw new ResolverError('Dropoff points are not enabled')
  }
}

import type { PickupReturnDataInput } from '../../typings/ReturnRequest'
import { ResolverError, UserInputError } from '@vtex/api'

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

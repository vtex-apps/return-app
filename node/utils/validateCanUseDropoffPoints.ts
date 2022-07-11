import type { AddressType } from 'vtex.return-app'
import { ResolverError } from '@vtex/api'

export const validateCanUsedropoffPoints = (
  addressType: AddressType,
  isPickupPointsEnabled?: boolean | null
) => {
  if (addressType === 'PICKUP_POINT' && !isPickupPointsEnabled) {
    throw new ResolverError('Dropoff points are not enabled')
  }
}

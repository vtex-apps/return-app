import type { ShippingData } from '../../../typings/OrderToReturn'
import type { OrderDetailsState } from '../provider/OrderToReturnReducer'

export const setInitialPickupAddress = (
  shippingData: ShippingData
): OrderDetailsState['pickupReturnData'] => {
  const { geoCoordinates, ...shippingDataWithoutGeoCoordinates } = shippingData

  if (shippingData.addressType === 'CUSTOMER_ADDRESS') {
    return shippingDataWithoutGeoCoordinates
  }

  /**
   * If addressType is PICKUP_POINT, we set empty values to state.
   * This way, if the store doesn't accept pickup orders, user has to enter an address manually.
   */
  return {
    addressId: 'N/A', // This field is not needed or used anywhere else, but it was marked as required in the schema.
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  }
}

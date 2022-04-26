import type { ShippingData } from 'vtex.return-app'

export const setInitialPickupAddress = (
  shippingData: ShippingData
): ShippingData => {
  if (shippingData.addressType === 'CUSTOMER_ADDRESS') return shippingData

  /**
   * If addressType is PICKUP_POINT, we set empty values to state.
   * This way, if the store doesn't accept pickup orders, user has to enter an address manually.
   */
  return {
    addressId: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    // Set to customer address. It will only change if the user set to use a pickup point to drop off the items.
    addressType: 'CUSTOMER_ADDRESS',
  }
}

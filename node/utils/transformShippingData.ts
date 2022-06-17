import type { ShippingData } from 'vtex.return-app'

import type { ShippingDetailWithGeoCoordinates } from '../clients/oms'

export const transformShippingData = (
  shippingData: ShippingDetailWithGeoCoordinates
): ShippingData => {
  const { address } = shippingData

  const complement = address.complement ?? ''

  /**
   * Order has type pickup for pickup orders.
   * Orders delivered into the customer address has type `residential`
   * TODO: Map other address types
   */
  const addressType =
    address.addressType === 'pickup' ? 'PICKUP_POINT' : 'CUSTOMER_ADDRESS'

  // eslint-disable-next-line no-console
  console.log(typeof address.geoCoordinates[0])

  return {
    addressId: address.addressId ?? '',
    country: address.country,
    city: address.city,
    address: `${address.street}, ${address.number ?? ''} ${complement}`.trim(),
    state: address.state,
    zipCode: address.postalCode,
    addressType,
    geoCoordinates: address.geoCoordinates,
  }
}

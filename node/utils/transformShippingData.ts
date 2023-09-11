import type { ShippingDetail } from '@vtex/clients'

import type { ShippingData } from '../../typings/OrderToReturn'

export const transformShippingData = (
  shippingData: ShippingDetail
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

  return {
    addressId: address.addressId ?? '',
    country: address.country,
    city: address.city,
    address: `${address.street}, ${address.number ?? ''} ${complement}`.trim(),
    state: address.state || '',
    zipCode: address.postalCode,
    addressType,
    // @ts-expect-error geoCoordinates is not typed in the OMS client project
    geoCoordinates: address.geoCoordinates,
  }
}

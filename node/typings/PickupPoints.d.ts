interface CheckoutOutput {
  items: CheckoutDistanceAndPickup[]
  paging: Paging
}

interface Paging {
  page: number
  perPage: number
  total: number
  pages: number
}

interface CheckoutDistanceAndPickup {
  distance: number
  pickupPoint: CheckoutPickupPoint
}

interface CheckoutPickupPoint {
  friendlyName: string
  address: CheckoutAddress
  id: string
  additionalInfo: unknown
  businessHours: Array<{
    closingTime: string
    openingTime: string
    dayOfWeek: number
  }>
}

interface CheckoutAddress {
  addressType: string
  receiverName: unknown
  addressId: string
  isDisposable: boolean
  postalCode: string
  city: string
  state: string
  country: string
  street: string
  number: string
  location: { latitude: number; longitude: number }
  neighborhood: string
  complement: string
  reference: string
  geoCoordinates: Coordinates[]
}

interface CheckoutPickupPointsArgs {
  lat: string
  long: string
}

interface Coordinates {
  lat: number
  long: number
}

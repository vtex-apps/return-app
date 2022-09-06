interface ItemToReturn {
  id: string
  quantity: number
  quantityAvailable: number
  isExcluded: boolean
  name: string
  localizedName?: string | null
  imageUrl: string
  orderItemIndex: number
}

type ReturnLabelAddress = {
  street1: string
  street2: string
  city: string
  state: string
  zip: string
  country: string
  name: string
  phone: string
}

type MaybeGlobal<T> = T | null

type GeoCoordinates = Array<MaybeGlobal<number>>

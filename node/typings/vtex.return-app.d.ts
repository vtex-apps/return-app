interface ReturnRequest {
  id: string
  createdIn: string
  userId: string
  orderId: string
  name: string
  email: string
  phoneNumber: string
  country: string
  locality: string
  state: string
  zip: string
  address: string
  returnLabel: string | null
  totalPrice: Int
  paymentMethod: string
  extraComment: string
  giftCardCode: string
  giftCardId: string
  refundedAmount: Int
  refundedShippingValue: Int
  iban: string
  accountHolder: string
  status: string
  dateSubmitted: string
  type: string
  sequenceNumber: string | null
}

type ReturnRequestInput = Omit<
  ReturnRequest,
  'id' | 'createdIn' | 'sequenceNumber' | 'type' | 'dateSubmitted'
>

type AuthToken = 'ADMIN_TOKEN' | 'STORE_TOKEN'

interface ProductReturned {
  id: string
  createdIn: string
  orderId: string
  userId: string
  imageUrl: string
  skuId: string
  sku: string
  productId: string
  ean: string
  brandId: string
  brandName: string
  skuName: string
  manufacturerCode: string
  unitPrice: number
  quantity: number
  totalPrice: number
  goodProducts: number
  reasonCode: string
  condition: string
  status: string
  refundId: string
  dateSubmitted: string
  type: string
}

type ProductReturnedInput = Omit<
  ReturnRequest,
  | 'id'
  | 'createdIn'
  | 'userId'
  | 'dateSubmitted'
  | 'refundId'
  | 'type'
  | 'manufacturerCode'
>

export interface ReturnReason {
  reason: string
  otherReason: string
  __typename?: 'ReturnReason'
}

export interface ReturnRequestItem {
  orderItemIndex: number
  name: string
  localizedName: string | null
  sellingPrice: number
  tax: number
  quantity: number
  imageUrl: string
  sellerName: string
  refId: string
  condition: string
  returnReason: ReturnReason
  __typename?: 'ReturnRequestItem'
}

export interface RefundableAmountTotal {
  id: string
  value: number
  __typename?: 'RefundableAmountTotal'
}

export interface CustomerProfileData {
  name: string
  email: string
  phoneNumber: string
  __typename?: 'CustomerProfileData'
}

export interface PickupReturnData {
  country: string
  city: string
  address: string
  state: string
  zipCode: string
  addressType: string
  __typename?: 'PickupReturnData'
}

export interface RefundPaymentData {
  refundPaymentMethod: string
  iban: string | null
  accountHolderName: string | null
  automaticallyRefundPaymentMethod: boolean
  __typename?: 'RefundPaymentData'
}

export interface RefundStatusData {
  status: string
  submittedBy: string
  createdAt: string
  comments: string[]
  __typename?: 'RefundStatusData'
}

export interface CultureInfoData {
  currencyCode: string
  locale: string
  __typename?: 'CultureInfoData'
}

export interface ReturnRequestAdditionalInfo {
  returnAction: string
  reasonCode: string
  shippingMethod: string
  locationCode: string
  refundShippingValue: number
  refundAdditionalValue: number
}

export interface ReturnRequestDetails {
  id: string
  status: string
  orderId: string
  refundableAmount: number
  additionalInfo: string // This could be parsed to ReturnRequestAdditionalInfo if needed
  items: ReturnRequestItem[]
  refundableAmountTotals: RefundableAmountTotal[]
  refundData: null | any // Adjust based on actual refund data structure
  customerProfileData: CustomerProfileData
  pickupReturnData: PickupReturnData
  refundPaymentData: RefundPaymentData
  refundStatusData: RefundStatusData[]
  cultureInfoData: CultureInfoData
  __typename?: 'ReturnRequestResponse'
}

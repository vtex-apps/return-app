export interface ReturnReason {
  reason: string
  otherReason?: string
}

export interface ReturnItem {
  orderItemIndex: number
  quantity: number
  condition: string
  returnReason?: ReturnReason
}

export interface CustomerProfileData {
  name: string
  email?: string
  phoneNumber: string
}

export interface PickupReturnData {
  addressId: string
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  addressType: string
}

export interface RefundPaymentData {
  refundPaymentMethod: string
  iban?: string
  accountHolderName?: string
}

export interface ReturnRequestForm {
  orderId: string
  items: ReturnItem[]
  customerProfileData: CustomerProfileData
  pickupReturnData: PickupReturnData
  refundPaymentData: RefundPaymentData
  userComment?: string
  locale: string
  additionalInfo?: string
}

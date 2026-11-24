/* tslint:disable */
/**
 * Return request document stored in Master Data (entity
 * vtex_return_app_returnRequest). Generated with json-schema-to-typescript
 * from the schema in node/masterdata/returnRequestSchema.ts. It lives in the repo
 * because the app no longer uses the masterdata builder, which used to
 * generate it.
 */

export interface ReturnRequest {
  orderId: string
  refundableAmount: number
  sequenceNumber: string
  status:
    | 'new'
    | 'processing'
    | 'pickedUpFromClient'
    | 'pendingVerification'
    | 'packageVerified'
    | 'amountRefunded'
    | 'denied'
    | 'cancelled'
  refundableAmountTotals: Array<{
    id: 'items' | 'shipping' | 'tax'
    value: number
    [k: string]: unknown
  }>
  customerProfileData: {
    userId: string
    name: string
    email: string
    phoneNumber: string
    [k: string]: unknown
  }
  pickupReturnData: {
    addressId: string
    address: string
    city: string
    state: string
    country: string
    zipCode: string
    addressType: 'PICKUP_POINT' | 'CUSTOMER_ADDRESS'
    returnLabel?: string
    [k: string]: unknown
  }
  refundPaymentData: {
    refundPaymentMethod: 'bank' | 'card' | 'giftCard' | 'sameAsPurchase'
    iban?: string | null
    accountHolderName?: string | null
    automaticallyRefundPaymentMethod?: boolean | null
    [k: string]: unknown
  }
  items: Array<{
    orderItemIndex: number
    id: string
    name: string
    localizedName?: string | null
    sellingPrice: number
    tax: number
    quantity: number
    imageUrl: string
    unitMultiplier: number
    sellerId: string
    sellerName?: string
    productId: string
    refId: string
    returnReason: {
      reason: string
      otherReason?: string | null
      [k: string]: unknown
    }
    condition:
      | 'unspecified'
      | 'newWithBox'
      | 'newWithoutBox'
      | 'usedWithBox'
      | 'usedWithoutBox'
    [k: string]: unknown
  }>
  dateSubmitted: string
  refundData: {
    invoiceNumber: string
    invoiceValue: number
    refundedItemsValue: number
    refundedShippingValue?: number
    giftCard?: {
      id: string
      redemptionCode: string
      [k: string]: unknown
    }
    items: Array<{
      orderItemIndex: number
      id: string
      price: number
      quantity: number
      restockFee: number
      [k: string]: unknown
    }>
    [k: string]: unknown
  } | null
  refundStatusData: Array<{
    status:
      | 'new'
      | 'processing'
      | 'pickedUpFromClient'
      | 'pendingVerification'
      | 'packageVerified'
      | 'amountRefunded'
      | 'denied'
      | 'cancelled'
    submittedBy: string
    createdAt: string
    comments: Array<{
      comment: string
      createdAt: string
      role: 'adminUser' | 'storeUser'
      submittedBy: string
      visibleForCustomer: boolean
      [k: string]: unknown
    }>
    [k: string]: unknown
  }>
  cultureInfoData: {
    currencyCode: string
    locale: string
    [k: string]: unknown
  }
  [k: string]: unknown
}

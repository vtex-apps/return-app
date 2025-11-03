interface UserProfile {
  email: string
  userId: string
  firstName?: string
  lastName?: string
  role: 'admin' | 'store-user'
}

interface SessionData {
  id: string
  namespaces: {
    profile: ProfileSession
    authentication: AuthenticationSession
  }
}

interface ProfileSession {
  id?: {
    value: string
  }
  email?: {
    value: string
  }
  firstName?: {
    value: string
  }
  lastName?: {
    value: string
  }
}

interface AuthenticationSession {
  adminUserEmail?: {
    value: string
  }
  adminUserId?: {
    value: string
  }
}

// Declare the 'odp.return-app' module for TypeScript
// Types are auto-generated from GraphQL schema during `vtex link`
// For local linting, we manually declare them here based on graphql/types/*.graphql
declare module 'odp.return-app' {
  // Basic types
  export type Maybe<T> = T | null | undefined

  // Enum types
  export type Status =
    | 'new'
    | 'processing'
    | 'pickedUpFromClient'
    | 'pendingVerification'
    | 'packageVerified'
    | 'amountRefunded'
    | 'denied'
    | 'cancelled'
    | 'closed'
  export type AdjustmentNoteStatus =
    | 'pending'
    | 'authorized'
    | 'refunded'
    | 'charged'
    | 'denied'
    | 'cancelled'
  export type AdjustmentNoteType = 'creditNote' | 'debitNote'
  export type ReturnType =
    | 'standardReturn'
    | 'creditReturn'
    | 'notDeliveryReturn'
  export type AddressType = 'PICKUP_POINT' | 'CUSTOMER_ADDRESS'
  export type RefundPaymentMethod =
    | 'bank'
    | 'card'
    | 'giftCard'
    | 'sameAsPurchase'
  export type ItemCondition =
    | 'unspecified'
    | 'newWithBox'
    | 'newWithoutBox'
    | 'usedWithBox'
    | 'usedWithoutBox'
  export type UserRole = 'adminUser' | 'storeUser'
  export type RefundableAmountId = 'items' | 'shipping' | 'tax' | 'additional'
  export type OrderToReturnValidation =
    | 'VALID'
    | 'ORDER_NOT_INVOICED'
    | 'OUT_OF_MAX_DAYS'
    | 'ALREADY_RETURNED'

  // Main interfaces
  export interface ReturnRequest {
    id?: string // Optional for creating new return requests
    orderId: string
    refundableAmount: number
    sequenceNumber: string
    createdIn?: string // Optional for creating new return requests
    status: Status
    dateSubmitted: string
    userComment?: string
    additionalInfo?: string
    refundableAmountTotals: RefundableAmountTotal[]
    customerProfileData: ClientProfileData
    pickupReturnData: PickupReturnData
    refundPaymentData: RefundPaymentData
    items: ReturnRequestItem[]
    refundData?: RefundData | null
    refundStatusData: RefundStatusData[]
    cultureInfoData: CultureInfoData
    // Additional properties used in services
    externalReference?: string
    locationCode?: string
    returnType?: ReturnType
    reasonCode?: string
    originalPaymentMethod?: string
  }

  export interface AdjustmentNote {
    id?: string // Optional for creating new adjustment notes
    orderId: string
    status: AdjustmentNoteStatus
    dateSubmitted: string
    userComment?: string
    additionalInfo?: string
    reasonCode?: string
    locationCode?: string
    originalPaymentMethod?: string
    items?: AdjustmentNoteItem[] // Optional for partial updates
    // Additional properties used in services
    type: AdjustmentNoteType
    requestAmount: number
    sequenceNumber?: string | number // Optional for creating new adjustment notes
    customerProfileData: ClientProfileData
    paymentData?: any
    authorizationData?: any
    transactionData?: any
    statusData?: any[]
    cultureInfoData?: CultureInfoData
    financialStatus?: string
  }

  export interface ReturnRequestCreated {
    returnRequestId: string
  }

  export interface ReturnRequestInput {
    orderId: string
    items: ReturnRequestItemInput[]
    customerProfileData: CustomerProfileDataInput
    pickupReturnData: PickupReturnDataInput
    refundPaymentData: RefundPaymentDataInput
    userComment?: string
    locale: string
    additionalInfo?: string
    financialStatus?: string
  }

  export interface ReturnRequestItemInput {
    orderItemIndex: number
    quantity: number
    condition?: ItemCondition
    returnReason: ReturnReasonInput
  }

  export interface ReturnReasonInput {
    reason: string
    otherReason?: string
  }

  export interface CustomerProfileDataInput {
    name: string
    email?: string
    phoneNumber: string
  }

  export interface PickupReturnDataInput {
    addressId: string
    address: string
    city: string
    state: string
    country: string
    zipCode: string
    addressType: AddressType
  }

  export interface RefundPaymentDataInput {
    refundPaymentMethod: RefundPaymentMethod
    iban?: string
    accountHolderName?: string
  }

  export interface ClientProfileDataInput {
    name: string
    email?: string
    phoneNumber: string
    userId?: string
  }

  // Response types
  export interface RefundableAmountTotal {
    id: RefundableAmountId
    value: number
  }

  export interface ClientProfileData {
    userId: string
    name: string
    email: string
    phoneNumber: string
  }

  export interface PickupReturnData {
    addressId: string
    address: string
    city: string
    state: string
    country: string
    zipCode: string
    addressType: AddressType
    returnLabel?: string
  }

  export interface RefundPaymentData {
    refundPaymentMethod: RefundPaymentMethod
    iban?: string
    accountHolderName?: string
    automaticallyRefundPaymentMethod?: boolean
  }

  export interface ReturnRequestItem {
    orderItemIndex: number
    quantity: number
    condition: ItemCondition
    returnReason: ReturnReason
    id: string
    sellingPrice: number
    tax: number
    name: string
    localizedName?: string | null
    imageUrl: string
    unitMultiplier: number
    sellerId: string
    sellerName: string
    productId: string
    refId: string
  }

  export interface ReturnReason {
    reason: string
    otherReason?: string
  }

  export interface RefundData {
    invoiceNumber: string
    invoiceValue: number
    refundedItemsValue: number
    refundedShippingValue: number
    refundedAdditionalValue: number
    giftCard?: GiftCard
    items: RefundItem[]
  }

  export interface GiftCard {
    id: string
    redemptionCode: string
  }

  export interface RefundItem {
    id?: string // Used in some utils but not in GraphQL
    orderItemIndex: number
    quantity: number
    restockFee: number
    price: number
  }

  export interface RefundStatusData {
    status: Status
    submittedBy?: string
    createdAt: string
    comments: RefundStatusComment[]
  }

  export interface RefundStatusComment {
    comment: string
    createdAt: string
    role: UserRole
    visibleForCustomer: boolean
    submittedBy: string
  }

  export interface CultureInfoData {
    currencyCode: string
    locale: string
  }

  // Additional types
  export interface AdjustmentNoteItem {
    orderItemIndex: number
    quantity: number
    id: string
    name: string
    sellingPrice: number
  }

  export interface CategoryInfo {
    id: string
    name: string
  }

  export interface PaymentType {
    bank: boolean
    card: boolean
    giftCard: boolean
  }

  export interface PaymentOptions {
    enablePaymentMethodSelection?: boolean
    allowedPaymentTypes: PaymentType
    automaticallyRefundPaymentMethod?: boolean
  }

  export interface ReturnAppSettings {
    maxDays: number
    excludedCategories: string[]
    paymentOptions: PaymentOptions
    termsUrl: string
    customReturnReasons?: CustomReturnReason[]
    options?: {
      enableOtherOptionSelection?: boolean
      enablePickupPoints?: boolean
      enableProportionalShippingValue?: boolean
      enableSelectItemCondition?: boolean
      enableHighlightFormMessage?: boolean
      [key: string]: any
    }
    // Additional properties for Dynatrace logging
    enableDynatraceLogging?: boolean
    dynatraceToken?: string
    logLevel?: string
  }

  // Query/Mutation argument types
  export interface QueryReturnRequestArgs {
    requestId: string
  }

  export interface QueryReturnRequestListArgs {
    filter?: ReturnRequestFilters
    page: number
    perPage?: number
  }

  export interface QueryAdjustmentNoteArgs {
    adjustmentId: string
  }

  export interface QueryAdjustmentNoteListArgs {
    filter?: AdjustmentNoteFilters
    page: number
    perPage?: number
  }

  export interface MutationCreateReturnRequestArgs {
    returnRequest: ReturnRequestInput
  }

  export interface MutationCreateAdjustmentNoteArgs {
    adjustmentNote: AdjustmentNoteInput
  }

  export interface MutationSaveReturnAppSettingsArgs {
    settings: ReturnAppSettingsInput
  }

  export interface MutationUpdateReturnRequestStatusArgs {
    requestId: string
    status: Status
    comment?: ReturnRequestCommentInput
    refundData?: RefundDataInput
  }

  export interface MutationUpdateAdjustmentNoteStatusArgs {
    adjustmentId: string
    status: AdjustmentNoteStatus
    comment?: ReturnRequestCommentInput
    authorizationData?: AuthorizationDataInput
    transactionData?: TransactionDataInput
  }

  export interface QueryNearestPickupPointsArgs {
    lat: string
    long: string
  }

  export interface ReturnRequestFilters {
    status?: Status
    sequenceNumber?: string
    id?: string
    createdIn?: DateRangeInput
    orderId?: string
    userId?: string
    userEmail?: string
    returnType?: ReturnType
    reasonCode?: string
    originalPaymentMethod?: string
    externalReference?: string
    locationCode?: string
  }

  export interface AdjustmentNoteFilters {
    status?: AdjustmentNoteStatus
    sequenceNumber?: string
    id?: string
    createdIn?: DateRangeInput
    orderId?: string
    userId?: string
    userEmail?: string
    reasonCode?: string
    locationCode?: string
    originalPaymentMethod?: string
  }

  export interface AdjustmentNoteInput {
    orderId: string
    type: AdjustmentNoteType
    requestAmount: number
    customerProfileData: CustomerProfileDataInput
    paymentData: AdjustmentPaymentDataInput
    userComment?: string
    locale: string
    additionalInfo?: string
    financialStatus?: string
    reasonCode?: string
    locationCode?: string
    originalPaymentMethod?: string
  }

  export interface AdjustmentPaymentDataInput {
    paymentMethod: 'giftCard' | 'sameAsPurchase'
  }

  export interface AuthorizationDataInput {
    authorizedAmount: number
  }

  export interface TransactionDataInput {
    invoiceValue: number
  }

  export interface AdjustmentNoteItemInput {
    orderItemIndex: number
    quantity: number
  }

  export interface DateRangeInput {
    from: string
    to: string
  }

  // Additional export types that might be used
  export interface OrdersToReturnList {
    list: any[]
    paging: any
  }

  export interface OrderToReturnSummary {
    orderId: string
    items?: any[]
    invoicedItems?: InvoicedItem[]
    excludedItems?: ExcludedItem[]
    processedItems?: ProcessedItem[]
    creationDate?: string
    clientProfileData?: any
    shippingData?: any
    paymentData?: any
  }

  export interface NearPickupPointQueryResponse {
    nearestPickupPoints: any[]
  }

  export interface InvoicedItem {
    id: string
    quantity: number
    orderItemIndex: number
    name?: string
    productId?: string
    imageUrl?: string
  }

  export interface ShippingData {
    addressId: string
    address: string
    city: string
    state: string
    country: string
    zipCode: string
    addressType: AddressType
  }

  export interface ReturnAppSettingsInput {
    maxDays: number
    excludedCategories: string[]
    paymentOptions: PaymentOptionsInput
    termsUrl: string
    customReturnReasons?: CustomReturnReasonInput[]
    options?: ReturnOptionInput
    enableDynatraceLogging?: boolean
    dynatraceToken?: string
    logLevel?: string
  }

  export interface PaymentOptionsInput {
    enablePaymentMethodSelection?: boolean
    allowedPaymentTypes: PaymentTypeInput
    automaticallyRefundPaymentMethod?: boolean
  }

  export interface PaymentTypeInput {
    bank?: boolean
    card?: boolean
    giftCard?: boolean
  }

  export interface ReturnOptionInput {
    enableOtherOptionSelection?: boolean
    enablePickupPoints?: boolean
    enableProportionalShippingValue?: boolean
    enableSelectItemCondition?: boolean
    enableHighlightFormMessage?: boolean
  }

  export interface CustomReturnReasonInput {
    reason: string
    maxDays: number
    translations?: CustomReturnReasonTranslationInput[]
  }

  export interface CustomReturnReasonTranslationInput {
    locale: string
    translation: string
  }

  export interface CustomReturnReason {
    reason: string
    maxDays: number
    translations?: CustomReturnReasonTranslation[]
  }

  export interface CustomReturnReasonTranslation {
    locale: string
    translation: string
  }

  export interface ReturnRequestCommentInput {
    value: string
    visibleForCustomer: boolean
  }

  export interface RefundDataInput {
    items: RefundItemInput[]
    refundedShippingValue: number
    refundedAdditionalValue: number
  }

  export interface RefundItemInput {
    orderItemIndex: number
    quantity: number
    restockFee: number
  }

  export interface AdjustmentNoteCreated {
    adjustmentNoteId: string
  }

  export interface ExcludedItem {
    id?: string
    itemIndex: number
    reason: {
      key: string
      value: string
    }
  }

  export interface ProcessedItem {
    id?: string
    itemIndex: number
    quantity: number
  }

  export interface Pagination {
    total: number
    pages: number
    currentPage: number
    perPage: number
  }

  // Type alias for return request created response
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export type returnRequestCreated = ReturnRequestCreated
}

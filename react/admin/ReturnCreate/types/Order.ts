interface Total {
  id: string
  name: string
  value: number
}

interface Seller {
  id: string
  name: string
  logo: string
  fulfillmentEndpoint: string
}

interface ClientPreferencesData {
  locale: string
  optinNewsLetter: boolean
}

interface CurrencyFormatInfo {
  CurrencyDecimalDigits: number
  CurrencyDecimalSeparator: string
  CurrencyGroupSeparator: string
  CurrencyGroupSize: number
  StartsWithCurrencySymbol: boolean
}

interface StorePreferencesData {
  countryCode: string
  currencyCode: string
  currencyFormatInfo: CurrencyFormatInfo
  currencyLocale: number
  currencySymbol: string
  timeZone: string
}

interface CustomAppFields {
  headlessErrors: string
  appId: string
  WMProfile: string
  b2bKey: string
  comments: string
  customField1: string
  customField2: string
}

interface CustomApp {
  fields: CustomAppFields
  id: string
  major: number
}

interface CustomData {
  customApps: CustomApp[]
}

interface Payment {
  id: string
  paymentSystem: string
  paymentSystemName: string
  value: number
  installments: number
  referenceValue: number
  cardHolder: string | null
  cardNumber: string | null
  firstDigits: string | null
  lastDigits: string | null
  cvv2: string | null
  expireMonth: string | null
  expireYear: string | null
  url: string | null
  giftCardId: string | null
  giftCardName: string | null
  giftCardCaption: string | null
  redemptionCode: string | null
  group: string
  tid: string | null
  dueDate: string | null
  connectorResponses: Record<string, unknown>
  giftCardProvider: string | null
  giftCardAsDiscount: string | null
  koinUrl: string | null
  accountId: string | null
  parentAccountId: string | null
  bankIssuedInvoiceIdentificationNumber: string | null
  bankIssuedInvoiceIdentificationNumberFormatted: string | null
  bankIssuedInvoiceBarCodeNumber: string | null
  bankIssuedInvoiceBarCodeType: string | null
  billingAddress: string | null
  paymentOrigin: string | null
}

interface Transaction {
  isActive: boolean
  transactionId: string
  merchantName: string
  payments: Payment[]
}

interface PaymentData {
  transactions: Transaction[]
  giftCards: unknown[]
}

interface Address {
  addressType: string
  receiverName: string
  addressId: string
  versionId: string | null
  entityId: string | null
  postalCode: string
  city: string
  state: string
  country: string
  street: string
  number: string
  neighborhood: string
  complement: string | null
  reference: string
  geoCoordinates: [number, number]
}

interface PickupStoreInfo {
  additionalInfo: string | null
  address: string | null
  dockId: string | null
  friendlyName: string | null
  isPickupStore: boolean
}

interface DeliveryId {
  courierId: string
  courierName: string
  dockId: string
  quantity: number
  warehouseId: string
  accountCarrierName: string
  kitItemDetails: unknown[]
}

interface DeliveryChannel {
  id: string
  stockBalance: number
}

interface LogisticsInfo {
  itemIndex: number
  itemId: string
  selectedSla: string
  selectedDeliveryChannel: string
  lockTTL: string
  price: number
  listPrice: number
  sellingPrice: number
  deliveryWindow: string | null
  deliveryCompany: string
  shippingEstimate: string
  shippingEstimateDate: string
  slas: Array<{
    id: string
    name: string
    shippingEstimate: string
    deliveryWindow: string | null
    availableDeliveryWindows: unknown[]
    price: number
    listPrice: number
    deliveryChannel: string
    pickupStoreInfo: PickupStoreInfo
    polygonName: string
    lockTTL: string
    pickupPointId: string | null
    transitTime: string
    pickupDistance: number
    deliveryIds: DeliveryId[]
    shippingEstimateDate: string
  }>
  shipsTo: string[]
  deliveryIds: DeliveryId[]
  deliveryChannels: DeliveryChannel[]
  deliveryChannel: string
  pickupStoreInfo: PickupStoreInfo
  addressId: string
  versionId: string | null
  entityId: string | null
  polygonName: string
  pickupPointId: string | null
  transitTime: string
}

export interface ShippingData {
  id: string
  address: Address
  logisticsInfo: LogisticsInfo[]
  trackingHints: unknown | null
  selectedAddresses: Address[]
  availableAddresses: Address[]
  contactInformation: unknown[]
}

interface ClientProfileData {
  id: string
  email: string
  firstName: string
  lastName: string
  documentType: string
  document: string
  phone: string
  corporateName: string
  tradeName: string
  corporateDocument: string
  stateInscription: string
  corporatePhone: string
  isCorporate: boolean
  userProfileId: string
  userProfileVersion: string | null
  customerClass: string | null
  customerCode: string | null
}

interface PriceTag {
  name: string
  value: number
  isPercentual: boolean
  identifier: string | null
  rawValue: number
  rate: string | null
  jurisCode: string | null
  jurisType: string | null
  jurisName: string | null
}

interface Dimension {
  cubicweight: number
  height: number
  length: number
  weight: number
  width: number
}

interface AdditionalInfo {
  brandName: string
  brandId: string
  categoriesIds: string
  categories: Array<{
    id: number
    name: string
  }>
  productClusterId: string
  commercialConditionId: string
  dimension: Dimension
  offeringInfo: unknown | null
  offeringType: string | null
  offeringTypeId: string | null
}

interface SellingPrice {
  value: number
  quantity: number
}

interface PriceDefinition {
  sellingPrices: SellingPrice[]
  calculatedSellingPrice: number
  total: number
  reason: string | null
}

interface Item {
  uniqueId: string
  id: string
  productId: string
  ean: string | null
  lockId: string
  itemAttachment: {
    content: Record<string, unknown>
    name: string | null
  }
  attachments: Array<{
    content: {
      customerItemId: string
      customerLineNumber: string
      customField1: string
    }
    name: string
  }>
  quantity: number
  seller: string
  name: string
  refId: string
  price: number
  listPrice: number
  manualPrice: number
  manualPriceAppliedBy: string
  priceTags: PriceTag[]
  imageUrl: string
  detailUrl: string
  components: unknown[]
  bundleItems: unknown[]
  params: unknown[]
  offerings: unknown[]
  attachmentOfferings: Array<{
    name: string
    required: boolean
    schema: Record<
      string,
      {
        MaximumNumberOfCharacters: number
        Domain: unknown[]
      }
    >
  }>
  sellerSku: string
  priceValidUntil: string
  commission: number
  tax: number
  preSaleDate: string | null
  additionalInfo: AdditionalInfo
  measurementUnit: string
  unitMultiplier: number
  sellingPrice: number
  isGift: boolean
  shippingPrice: number | null
  rewardValue: number
  freightCommission: number
  priceDefinition: PriceDefinition
  taxCode: string
  parentItemIndex: number | null
  parentAssemblyBinding: string | null
  callCenterOperator: string | null
  serialNumbers: string | null
  assemblies: unknown[]
  costPrice: number
}

export interface Order {
  orderId: string
  sequence: string
  marketplaceOrderId: string
  marketplaceServicesEndpoint: string
  sellerOrderId: string
  origin: string
  affiliateId: string
  salesChannel: string
  merchantName: string | null
  status: string
  workflowIsInError: boolean
  statusDescription: string
  value: number
  creationDate: string
  lastChange: string
  orderGroup: string
  followUpEmail: string
  lastMessage: string | null
  hostname: string
  isCompleted: boolean
  roundingError: number
  orderFormId: string
  allowCancellation: boolean
  allowEdition: boolean
  isCheckedIn: boolean
  authorizedDate: string
  invoicedDate: string | null
  cancelReason: string | null
  checkedInPickupPointId: string | null
  totals: Total[]
  sellers: Seller[]
  clientPreferencesData: ClientPreferencesData
  cancellationData: unknown | null
  taxData: unknown | null
  subscriptionData: unknown | null
  itemMetadata: {
    Items: Array<{
      Id: string
      Seller: string
      Name: string
      SkuName: string
      ProductId: string
      RefId: string
      Ean: string | null
      ImageUrl: string
      DetailUrl: string
      AssemblyOptions: Array<{
        Id: string
        Name: string
        Required: boolean
        InputValues: Record<
          string,
          {
            MaximumNumberOfCharacters: number
            Domain: unknown[]
          }
        >
        Composition: unknown | null
      }>
    }>
  }
  marketplace: {
    baseURL: string
    isCertified: string | null
    name: string
  }
  storePreferencesData: StorePreferencesData
  customData: CustomData
  commercialConditionData: unknown | null
  openTextField: string | null
  invoiceData: unknown | null
  changesAttachment: unknown | null
  callCenterOperatorData: unknown | null
  packageAttachment: {
    packages: unknown[]
  }
  paymentData: PaymentData
  shippingData: ShippingData
  ratesAndBenefitsData: {
    id: string
    rateAndBenefitsIdentifiers: unknown[]
  }
  marketingData: {
    id: string
    utmSource: string
    utmPartner: string | null
    utmMedium: string | null
    utmCampaign: string | null
    coupon: string | null
    utmiCampaign: string | null
    utmipage: string | null
    utmiPart: string | null
    marketingTags: unknown[]
  }
  giftRegistryData: unknown | null
  clientProfileData: ClientProfileData
  items: Item[]
  marketplaceItems: unknown[]
  cancellationRequests: unknown | null
  approvedBy: string | null
  cancelledBy: string | null
  purchaseAgentData: unknown | null
}

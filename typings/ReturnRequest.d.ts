export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export interface ReturnRequest {
  orderId: string;
  sellerName?: string;
  refundableAmount: number;
  sequenceNumber: string;
  status:
    | "new"
    | "processing"
    | "pickedUpFromClient"
    | "pendingVerification"
    | "packageVerified"
    | "amountRefunded"
    | "denied"
    | "cancelled";
  refundableAmountTotals: {
    id: "items" | "shipping" | "tax";
    value: number;
    [k: string]: unknown;
  }[];
  customerProfileData: {
    userId: string;
    name: string;
    email: string;
    phoneNumber: string;
    [k: string]: unknown;
  };
  pickupReturnData: {
    addressId: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    addressType: "PICKUP_POINT" | "CUSTOMER_ADDRESS";
    returnLabel?: string;
    [k: string]: unknown;
  };
  refundPaymentData: {
    refundPaymentMethod: "bank" | "card" | "giftCard" | "sameAsPurchase";
    iban?: string | null;
    accountHolderName?: string | null;
    automaticallyRefundPaymentMethod?: boolean | null;
    [k: string]: unknown;
  };
  items: {
    orderItemIndex: number;
    id: string;
    name: string;
    localizedName?: string | null;
    sellingPrice: number;
    tax: number;
    quantity: number;
    imageUrl: string;
    unitMultiplier: number;
    sellerId: string;
    sellerName?: string;
    productId: string;
    refId: string;
    returnReason: {
      reason: string;
      otherReason?: string | null;
      [k: string]: unknown;
    };
    condition: "unspecified" | "newWithBox" | "newWithoutBox" | "usedWithBox" | "usedWithoutBox";
    [k: string]: unknown;
  }[];
  dateSubmitted: string;
  refundData: {
    invoiceNumber: string;
    invoiceValue: number;
    refundedItemsValue: number;
    refundedShippingValue?: number;
    giftCard?: {
      id: string;
      redemptionCode: string;
      [k: string]: unknown;
    };
    items: {
      orderItemIndex: number;
      id: string;
      price: number;
      quantity: number;
      restockFee: number;
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  } | null;
  refundStatusData: {
    status:
      | "new"
      | "processing"
      | "pickedUpFromClient"
      | "pendingVerification"
      | "packageVerified"
      | "amountRefunded"
      | "denied"
      | "cancelled";
    submittedBy: string;
    createdAt: string;
    comments: {
      comment: string;
      createdAt: string;
      role: "adminUser" | "storeUser";
      submittedBy: string;
      visibleForCustomer: boolean;
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  }[];
  cultureInfoData: {
    currencyCode: string;
    locale: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export type ReturnRequestInput = {
  orderId: Scalars['String'];
  sellerName?: InputMaybe<Scalars['String']>;
  items: Array<ReturnRequestItemInput>;
  customerProfileData: CustomerProfileDataInput;
  pickupReturnData: PickupReturnDataInput;
  refundPaymentData: RefundPaymentDataInput;
  userComment?: InputMaybe<Scalars['String']>;
  locale: Scalars['String'];
};

export type ReturnRequestItemInput = {
  orderItemIndex: Scalars['Int'];
  quantity: Scalars['Int'];
  condition?: InputMaybe<ItemCondition>;
  returnReason: ReturnReasonInput;
};

export type ReturnReasonInput = {
  reason: Scalars['String'];
  otherReason?: InputMaybe<Scalars['String']>;
};

export type ItemCondition = 
  | 'unspecified'
  | 'newWithBox'
  | 'newWithoutBox'
  | 'usedWithBox'
  | 'usedWithoutBox';

export type CustomerProfileDataInput = {
  name: Scalars['String'];
  email?: InputMaybe<Scalars['String']>;
  phoneNumber: Scalars['String'];
};

export type PickupReturnDataInput = {
  addressId: Scalars['String'];
  address: Scalars['String'];
  city: Scalars['String'];
  state: Scalars['String'];
  country: Scalars['String'];
  zipCode: Scalars['String'];
  addressType: AddressType;
};

export type AddressType = 
  | 'PICKUP_POINT'
  | 'CUSTOMER_ADDRESS';

export type RefundPaymentDataInput = {
  refundPaymentMethod: RefundPaymentMethod;
  iban?: InputMaybe<Scalars['String']>;
  accountHolderName?: InputMaybe<Scalars['String']>;
};

export type RefundPaymentMethod =
  | 'bank'
  | 'card'
  | 'giftCard'
  | 'sameAsPurchase';

export type ReturnRequestResponse = {
  __typename?: 'ReturnRequestResponse';
  id: Scalars['ID'];
  sellerName?: Maybe<Scalars['String']>;
  orderId: Scalars['String'];
  refundableAmount: Scalars['Int'];
  sequenceNumber: Scalars['String'];
  createdIn: Scalars['String'];
  status: Status;
  dateSubmitted: Scalars['String'];
  userComment?: Maybe<Scalars['String']>;
  refundableAmountTotals: Array<RefundableAmountTotal>;
  customerProfileData: CustomerProfileData;
  pickupReturnData: PickupReturnData;
  refundPaymentData: RefundPaymentData;
  items: Array<ReturnRequestItem>;
  refundData?: Maybe<RefundData>;
  refundStatusData: Array<RefundStatusData>;
  cultureInfoData: CultureInfoData;
};

export type Status = 
  | 'new'
  | 'processing'
  | 'pickedUpFromClient'
  | 'pendingVerification'
  | 'packageVerified'
  | 'amountRefunded'
  | 'denied'
  | 'cancelled';

export type CustomerProfileData = {
  __typename?: 'CustomerProfileData';
  userId: Scalars['String'];
  name: Scalars['String'];
  email: Scalars['String'];
  phoneNumber: Scalars['String'];
};

export type PickupReturnData = {
  __typename?: 'PickupReturnData';
  addressId: Scalars['String'];
  address: Scalars['String'];
  city: Scalars['String'];
  state: Scalars['String'];
  country: Scalars['String'];
  zipCode: Scalars['String'];
  addressType: AddressType;
  returnLabel?: Maybe<Scalars['String']>;
};

export type RefundPaymentData = {
  __typename?: 'RefundPaymentData';
  refundPaymentMethod: RefundPaymentMethod;
  iban?: Maybe<Scalars['String']>;
  accountHolderName?: Maybe<Scalars['String']>;
  automaticallyRefundPaymentMethod?: Maybe<Scalars['Boolean']>;
};

export type ReturnRequestItem = {
  __typename?: 'ReturnRequestItem';
  orderItemIndex: Scalars['Int'];
  quantity: Scalars['Int'];
  condition: ItemCondition;
  returnReason: ReturnReason;
  /** id: SKU id */
  id: Scalars['String'];
  sellingPrice: Scalars['Int'];
  tax: Scalars['Int'];
  name: Scalars['String'];
  localizedName?: Maybe<Scalars['String']>;
  imageUrl: Scalars['String'];
  unitMultiplier: Scalars['Float'];
  sellerId: Scalars['String'];
  sellerName: Scalars['String'];
  productId: Scalars['String'];
  refId: Scalars['String'];
};

export type ReturnReason = {
  __typename?: 'ReturnReason';
  reason: Scalars['String'];
  otherReason?: Maybe<Scalars['String']>;
};

export type RefundData = {
  __typename?: 'RefundData';
  invoiceNumber: Scalars['String'];
  invoiceValue: Scalars['Int'];
  refundedItemsValue: Scalars['Int'];
  refundedShippingValue: Scalars['Int'];
  giftCard?: Maybe<GiftCard>;
  items: Array<RefundItem>;
};

export type GiftCard = {
  __typename?: 'GiftCard';
  id: Scalars['String'];
  redemptionCode: Scalars['String'];
};

export type RefundItem = {
  __typename?: 'RefundItem';
  orderItemIndex: Scalars['Int'];
  quantity: Scalars['Int'];
  restockFee: Scalars['Int'];
  price: Scalars['Int'];
};

export type RefundStatusData = {
  __typename?: 'RefundStatusData';
  status: Status;
  submittedBy?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  comments: Array<RefundStatusComment>;
};

export type RefundStatusComment = {
  __typename?: 'RefundStatusComment';
  comment: Scalars['String'];
  createdAt: Scalars['String'];
  role: UserRole;
  visibleForCustomer?: Maybe<Scalars['Boolean']>;
  submittedBy: Scalars['String'];
};

export type ReturnRequestFilters = {
  status?: Maybe<Status>;
  sequenceNumber?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  sellerName?: Maybe<Scalars['String']>;
  /**
   * createdIn: It uses the field dateSubmitted in the return request schema to search for documents.
   * The field createdIn is auto generated when the document is created, not
   * reflecting the real value for documents migrated from older versions.
   */
  createdIn?: Maybe<DateRangeInput>;
  orderId?: Maybe<Scalars['String']>;
  /** userId: If not passed, resolver will try to get it from cookie session */
  userId?: Maybe<Scalars['String']>;
  userEmail?: Maybe<Scalars['String']>;
  status?: InputMaybe<Status>;
  sequenceNumber?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  sellerName?: InputMaybe<Scalars['String']>;
  createdIn?: InputMaybe<DateRangeInput>;
  orderId?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
  userEmail?: InputMaybe<Scalars['String']>;
};

export type DateRangeInput = {
  from: Scalars['String'];
  to: Scalars['String'];
};

export type ReturnRequestList = {
  __typename?: 'ReturnRequestList';
  list: Array<ReturnRequestResponse>;
  paging: Pagination;
};

export type RefundDataInput = {
  items: Array<RefundItemInput>;
  refundedShippingValue: Scalars['Int'];
};

export type RefundItemInput = {
  orderItemIndex: Scalars['Int'];
  quantity: Scalars['Int'];
  restockFee: Scalars['Int'];
};

export type ReturnRequestCommentInput = {
  value: Scalars['String'];
  visibleForCustomer: Scalars['Boolean'];
};

export type RefundableAmountTotal = {
  __typename?: 'RefundableAmountTotal';
  id: RefundableAmountId;
  value: Scalars['Int'];
};

export type RefundableAmountId =
  | 'items'
  | 'shipping'
  | 'tax';


export type UserRole =
  | 'adminUser'
  | 'storeUser';

export type CultureInfoData = {
  __typename?: 'CultureInfoData';
  currencyCode: Scalars['String'];
  locale: Scalars['String'];
};

export type Pagination = {
  __typename?: 'Pagination';
  total: Scalars['Int'];
  pages: Scalars['Int'];
  currentPage: Scalars['Int'];
  perPage: Scalars['Int'];
};

export type MutationCreateReturnRequestArgs = {
  returnRequest: ReturnRequestInput;
};

export type QueryReturnRequestArgs = {
  requestId: Scalars['ID'];
};

export type QueryReturnRequestListArgs = {
  filter?: Maybe<ReturnRequestFilters>;
  page: Scalars['Int'];
  perPage?: Maybe<Scalars['Int']>;
  isAdmin?: Scalars['Boolean'];
};

export type MutationUpdateReturnRequestStatusArgs = {
  requestId: Scalars['ID'];
  sellerName?: Maybe<Scalars['String']>;
  status: Status;
  comment?: Maybe<ReturnRequestCommentInput>;
  refundData?: Maybe<RefundDataInput>;
};

export type ReturnRequestCreated = {
  __typename?: 'returnRequestCreated';
  returnRequestId: Scalars['String'];
};
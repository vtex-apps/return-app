import type { AddressType } from './ReturnRequest'

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

export type CategoryInfo = {
  __typename?: 'CategoryInfo';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type OrdersToReturnList = {
  __typename?: 'OrdersToReturnList';
  list?: Maybe<Array<Maybe<OrderToReturnSummary>>>;
  paging?: Maybe<Pagination>;
};

export type OrderToReturnSummary = {
  __typename?: 'OrderToReturnSummary';
  orderId: Scalars['String'];
  sellerName: Scalars['String'];
  creationDate: Scalars['String'];
  /** Items invoiced / sent to costumer with items details. */
  invoicedItems: Array<InvoicedItem>;
  /**
   * Items committed to return or already returned (invoiced as Input) that cannot be considered to be returned anymore.
   * The itemIndex property is used to identify the item in the list of invoiced items.
   */
  processedItems: Array<ProcessedItem>;
  /**
   * Items forbidden to be return.
   * The itemIndex property is used to identify the item in the list of invoiced items.
   */
  excludedItems: Array<ExcludedItem>;
  clientProfileData: ClientProfileData;
  shippingData: ShippingData;
  paymentData: PaymentData;
};

export type Pagination = {
  __typename?: 'Pagination';
  total: Scalars['Int'];
  pages: Scalars['Int'];
  currentPage: Scalars['Int'];
  perPage: Scalars['Int'];
};

export type InvoicedItem = {
  __typename?: 'InvoicedItem';
  id: Scalars['String'];
  productId: Scalars['String'];
  quantity: Scalars['Int'];
  name: Scalars['String'];
  localizedName?: Maybe<Scalars['String']>;
  imageUrl: Scalars['String'];
  /** The index of the item in the Order. */
  orderItemIndex: Scalars['Int'];
};

export type ProcessedItem = {
  __typename?: 'ProcessedItem';
  itemIndex: Scalars['Int'];
  quantity: Scalars['Int'];
};

export type ExcludedItem = {
  __typename?: 'excludedItem';
  itemIndex: Scalars['Int'];
  reason: ExcludedReason;
};

export type ExcludedReason = {
  __typename?: 'ExcludedReason';
  key: ExcludedReasonEnum;
  value: Scalars['String'];
};

export type ExcludedReasonEnum =
  | 'EXCLUDED_CATEGORY'

export type OrderToReturnValidation = 
  | 'OUT_OF_MAX_DAYS'
  | 'ORDER_NOT_INVOICED';

export type ClientProfileData = {
  __typename?: 'ClientProfileData';
  name: Scalars['String'];
  email: Scalars['String'];
  phoneNumber: Scalars['String'];
};

export type ShippingData = {
  __typename?: 'ShippingData';
  addressId: Scalars['String'];
  address: Scalars['String'];
  city: Scalars['String'];
  state: Scalars['String'];
  country: Scalars['String'];
  zipCode: Scalars['String'];
  addressType: AddressType;
  geoCoordinates: Array<Maybe<Scalars['Float']>>;
};

export type PaymentData = {
  __typename?: 'PaymentData';
  canRefundCard: Scalars['Boolean'];
};

export type CreatedInInput = {
  from: Scalars['String'];
  to: Scalars['String'];
};

export type OrdersFilters = {
  createdIn?: InputMaybe<CreatedInInput>;
  orderId?: InputMaybe<Scalars['String']>;
  sellerName?: InputMaybe<Scalars['String']>;
};

export type QueryOrdersAvailableToReturnArgs = {
  page: Scalars['Int'];
  storeUserEmail?: Maybe<Scalars['String']>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<OrdersFilters>;
};

export type QueryOrderToReturnSummaryArgs = {
  orderId: Scalars['ID'];
  storeUserEmail?: Maybe<Scalars['String']>;
};

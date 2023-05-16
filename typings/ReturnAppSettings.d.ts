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

export type ReturnAppSettings = {
  __typename?: 'ReturnAppSettings';
  maxDays: Scalars['Int'];
  excludedCategories: Array<Scalars['String']>;
  paymentOptions: PaymentOptions;
  termsUrl: Scalars['String'];
  customReturnReasons?: Maybe<Array<CustomReturnReason>>;
  options?: Maybe<ReturnOption>;
  orderStatus: Scalars['String'];
  sellerId?: Scalars['String'];
};

export type PaymentOptions = {
  __typename?: 'PaymentOptions';
  enablePaymentMethodSelection?: Maybe<Scalars['Boolean']>;
  allowedPaymentTypes: PaymentType;
  automaticallyRefundPaymentMethod?: Maybe<Scalars['Boolean']>;
};

export type PaymentType = {
  __typename?: 'PaymentType';
  bank?: Maybe<Scalars['Boolean']>;
  card?: Maybe<Scalars['Boolean']>;
  giftCard?: Maybe<Scalars['Boolean']>;
};

export type CustomReturnReason = {
  __typename?: 'CustomReturnReason';
  reason: Scalars['String'];
  maxDays: Scalars['Int'];
  translations?: Maybe<Array<CustomReturnReasonTranslation>>;
};

export type CustomReturnReasonTranslation = {
  __typename?: 'CustomReturnReasonTranslation';
  locale: Scalars['String'];
  translation: Scalars['String'];
};

export type ReturnOption = {
  __typename?: 'ReturnOption';
  enableOtherOptionSelection?: Maybe<Scalars['Boolean']>;
  enablePickupPoints?: Maybe<Scalars['Boolean']>;
  enableProportionalShippingValue?: Maybe<Scalars['Boolean']>;
  enableSelectItemCondition?: Maybe<Scalars['Boolean']>;
  enableHighlightFormMessage: Maybe<Scalars['Boolean']>;
};

export type ReturnAppSettingsInput = {
  maxDays: Scalars['Int'];
  excludedCategories: Array<Scalars['String']>;
  paymentOptions: PaymentOptionsInput;
  termsUrl: Scalars['String'];
  customReturnReasons?: InputMaybe<Array<CustomReturnReasonInput>>;
  options?: InputMaybe<ReturnOptionInput>;
  orderStatus: Scalars['String'];
  sellerId?: Scalars['String'];
};

export type PaymentOptionsInput = {
  enablePaymentMethodSelection?: InputMaybe<Scalars['Boolean']>;
  allowedPaymentTypes: PaymentTypeInput;
  automaticallyRefundPaymentMethod?: InputMaybe<Scalars['Boolean']>;
};

export type PaymentTypeInput = {
  bank?: InputMaybe<Scalars['Boolean']>;
  card?: InputMaybe<Scalars['Boolean']>;
  giftCard?: InputMaybe<Scalars['Boolean']>;
};

export type CustomReturnReasonInput = {
  reason: Scalars['String'];
  maxDays: Scalars['Int'];
  translations?: InputMaybe<Array<CustomReturnReasonTranslationInput>>;
};

export type CustomReturnReasonTranslationInput = {
  locale: Scalars['String'];
  translation: Scalars['String'];
};

export type ReturnOptionInput = {
  enableOtherOptionSelection?: InputMaybe<Scalars['Boolean']>;
  enablePickupPoints?: InputMaybe<Scalars['Boolean']>;
  enableProportionalShippingValue?: InputMaybe<Scalars['Boolean']>;
  enableSelectItemCondition?: InputMaybe<Scalars['Boolean']>;
  enableHighlightFormMessage: Maybe<Scalars['Boolean']>;
};

export type MutationSaveReturnAppSettingsArgs = {
  settings: ReturnAppSettingsInput;
};

export type MutationSaveReturnAppSettingsArgs = {
  settings: ReturnAppSettingsInput;
};

export type QueryReturnSettingsListArgs = {
  filter?: Maybe<ReturnSettingsFilters>;
  page: Scalars['Int'];
  perPage?: Maybe<Scalars['Int']>;
};


export type ReturnSettingsList = {
  __typename?: 'ReturnSettingsList';
  list: Array<ReturnSettingsResponse>;
  paging: Pagination;
};

export type ReturnSettingsResponse = {
  __typename?: 'ReturnSettingsResponse';
  id: Scalars['ID'];
  sellerId?: Maybe<Scalars['String']>;
  maxDays: Scalars['Int'];
  excludedCategories: Array<Scalars['String']>;
  paymentOptions: PaymentOptions;
  termsUrl: Scalars['String'];
  customReturnReasons?: Maybe<Array<CustomReturnReason>>;
  options?: Maybe<ReturnOption>;
};

export type Pagination = {
  __typename?: 'Pagination';
  total: Scalars['Int'];
  pages: Scalars['Int'];
  currentPage: Scalars['Int'];
  perPage: Scalars['Int'];
};
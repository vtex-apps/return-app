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

export type NearPickupPointQueryResponse = {
  __typename?: 'NearPickupPointQueryResponse';
  items: Array<CheckoutPickupPoint>;
};

export type CheckoutPickupPoint = {
  __typename?: 'CheckoutPickupPoint';
  pickupPoint: PickupPoint;
};

export type PickupPoint = {
  __typename?: 'PickupPoint';
  friendlyName: Scalars['String'];
  address: CheckoutAddress;
  id: Scalars['String'];
};

export type CheckoutAddress = {
  __typename?: 'CheckoutAddress';
  addressType: Scalars['String'];
  addressId: Scalars['String'];
  isDisposable: Scalars['Boolean'];
  postalCode: Scalars['String'];
  city: Scalars['String'];
  state: Scalars['String'];
  country: Scalars['String'];
  street: Scalars['String'];
  number?: Maybe<Scalars['String']>;
  neighborhood?: Maybe<Scalars['String']>;
  complement?: Maybe<Scalars['String']>;
  reference?: Maybe<Scalars['String']>;
  geoCoordinates: Array<Maybe<Scalars['Float']>>;
};

export type QueryNearestPickupPointsArgs = {
  lat: Scalars['String'];
  long: Scalars['String'];
};

export type NearPickupPointQueryResponse = {
  __typename?: 'NearPickupPointQueryResponse';
  items: Array<CheckoutPickupPoint>;
};
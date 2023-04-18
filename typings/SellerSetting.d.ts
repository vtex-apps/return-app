import type {
  CustomReturnReason,
  ReturnOption,
  PaymentOptionsInput,
  CustomReturnReasonInput,
  ReturnOptionInput,
  ReturnAppSettings,
  ReturnAppSettingsInput
} from './ReturnAppSettings'

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

export interface SellerSetting extends ReturnAppSettings {
  __typename?: 'SellerSetting';
  id?: Maybe<Scalars['String']>;
  sellerId?: Scalars['String'];
};


export type SellerSettingResponseList = {
  __typename?: 'SellerSettingResponseList';
  sellers?: Maybe<Array<Maybe<SellerSetting>>>;
};

export interface SellerSettingInput extends ReturnAppSettingsInput{
  id?: InputMaybe<Scalars['String']>;
  sellerId?: Scalars['String'];
};

export type QueryReturnSellerSettingsArgs = {
  sellerId: Scalars['String'];
};

export type MutationUpdateSellerSettingArgs = {
  id: Scalars['ID'];
  settings: SellerSettingInput;
};

export type MutationSaveSellerSettingArgs = {
  settings: SellerSettingInput;
};
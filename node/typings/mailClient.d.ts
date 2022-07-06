import type { ReturnRequestItem, Status } from 'vtex.return-app'

export interface MailData {
  templateName: string
  jsonData: JsonData
}

export interface JsonData {
  data: Data
  products: ReturnRequestItem[] | ReturnRequest['items']
  refundStatusData?: ReturnRequest['refundStatusData']
  _accountInfo?: AccountInfo
}

export interface Data {
  status?: Status
  name?: string
  DocumentId?: string
  email?: string
  phoneNumber?: string
  country?: string
  locality?: string
  address?: string
  paymentMethod?: string
  iban?: string | null
  refundedAmount?: number
  giftCardCode?: string
  dateSubmitted?: string
}

export interface AccountInfo {
  Id: string
  TradingName: string
  HostName: string
}
export interface Template {
  AccountId: string | null
  AccountName: string | null
  ApplicationId: string | null
  Description: string | null
  FriendlyName: string
  IsDefaultTemplate: boolean
  IsPersisted: boolean
  IsRemoved: boolean
  Name: string
  Type: string
  Templates: {
    email: {
      To: string
      CC: string | null
      BCC: string | null
      Subject: string
      Message: string
      Type: string
      ProviderId: string
      ProviderName: string | null
      IsActive: boolean
      withError: boolean
    }
    sms: {
      Type: string
      ProviderId: string | null
      ProviderName: string | null
      IsActive: boolean
      withError: boolean
      Parameters: string[]
    }
  }
}

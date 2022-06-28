interface MailData {
  templateName: string
  jsonData: JsonData
}

interface JsonData {
  data: Data
  products: any
  timeline?: TimelineItem[]
  _accountInfo?: AccountInfo
}

interface Data {
  status?: string
  name?: string
  DocumentId?: string
  email?: string
  phoneNumber?: string
  country?: string
  locality?: string
  address?: string
  paymentMethod?: string
  iban?: string
  refundedAmount?: string
  giftCardCode?: string
  dateSubmitted?: string
  [key: string]: string
}

interface TimelineItem {
  status: string
  text: any
  step: number
  comments: any
  active: number
}

interface AccountInfo {
  Id: string
  TradingName: string
  HostName: string
}
interface Template {
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

interface MailData {
  templateName: string
  jsonData: JsonData
}

interface JsonData {
  data: any
  products: any
  timeline: Array<{
    status: string
    step: number
    comments: any
    active: number
  }>
}

interface Template {
  AccountId?: string
  AccountName?: string
  ApplicationId?: string
  Description?: string
  FriendlyName: string
  IsDefaultTemplate: boolean
  IsPersisted: boolean
  IsRemoved: boolean
  Name: string
  Type: string
  Templates: {
    email: {
      To: string
      CC?: string
      BCC?: string
      Subject: string
      Message: string
      Type: string
      ProviderId: string
      ProviderName?: string
      IsActive: boolean
      withError: boolean
    }
    sms: {
      Type: string
      ProviderId?: string
      ProviderName?: string
      IsActive: boolean
      withError: boolean
      Parameters: string[]
    }
  }
}

import type {
  ReturnRequest,
  RefundStatusData,
  ReturnRequestItem,
  Status,
} from 'vtex.return-app'

interface MailData<DataType> {
  templateName: string
  jsonData: DataType
}

interface ConfirmationData {
  data: {
    status: Status['new']
    name: string
    DocumentId: string
    email: string
    phoneNumber: string
    country: string
    locality: string
    address: string
    paymentMethod: string
  }
  products: ReturnRequestItem[]
  refundStatusData: RefundStatusData[]
}

interface StatusUpdateData {
  data: {
    status: Status
    name: string
    DocumentId: string
    email: string
    paymentMethod: string
    iban: string
    refundedAmount?: number
  }
  products: ReturnRequest['items']
  refundStatusData: RefundStatusData[]
}

interface ReturnLabelData {
  data: {
    name: string
    DocumentId: string
    email: string
    labelUrl: string
  }
}

export type TemplateName = 'confirmation' | 'status-update' | 'label'

export type TemplateFriendlyName = 'Confirmation' | 'Status Update' | 'Label'

export type ConfirmationMailData = MailData<ConfirmationData>

export type StatusUpdateMailData = MailData<StatusUpdateData>

export type ReturnLabelMailData = MailData<ReturnLabelData>

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

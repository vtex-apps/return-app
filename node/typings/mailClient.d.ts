import type { ReturnRequestItem, Status } from '../../typings/ReturnRequest'

export type ReturnRequestConfirmation = string

export type ReturnRequestStatusUpdate = string

export interface ConfirmationMailData {
  templateName: ReturnRequestConfirmation
  jsonData: {
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
    refundStatusData: ReturnRequest['refundStatusData']
  }
}

export interface StatusUpdateMailData {
  templateName: ReturnRequestStatusUpdate
  jsonData: {
    data: {
      status: Status
      name: string
      DocumentId: string
      email: string
      paymentMethod: string
      iban: string
      refundedAmount: number
    }
    products: ReturnRequest['items']
    refundStatusData: ReturnRequest['refundStatusData']
  }
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

export interface InvoiceRequest {
  type: string
  items: Item[]
  issuanceDate: string
  invoiceNumber: string
  invoiceValue: number
  invoiceUrl: string
  courier: string
  trackingNumber: string
  trackingUrl: string
  dispatchDate: string | null | undefined
}

export interface Item {
  id: string
  description: string
  price: number
  quantity: number
}

export interface InvoiceResponse {
  date: string
  orderId: string
  receipt: string
}

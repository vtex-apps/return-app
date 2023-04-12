export type OrderStatus = {
  label: string
  value: string
}

export const ORDER_STATUS: OrderStatus[] = [
  {
    label: 'Order accepted',
    value: 'f_creationDate'
  },
  {
    label: 'Payment approved',
    value: 'f_authorizedDate'
  },
  {
    label: 'Invoiced',
    value: 'f_invoicedDate'
  }
]
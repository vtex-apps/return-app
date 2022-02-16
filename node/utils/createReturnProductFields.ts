interface CreateReturnProductFieldsArgs {
  item: ProductReturnedInput
  userId: string
  orderId: string
  refundId: string
  status?: string
  manufacturerCode?: string
  totalPrice: number
}

export const createReturnProductFields = ({
  item,
  userId,
  orderId,
  refundId,
  totalPrice,
  status = 'New',
  manufacturerCode = '',
}: CreateReturnProductFieldsArgs) => {
  return {
    ...item,
    userId,
    orderId,
    refundId,
    totalPrice,
    status,
    manufacturerCode,
    type: 'product',
    dateSubmitted: new Date().toISOString(),
  }
}

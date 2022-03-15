interface CreateReturnRequestFieldsArgs {
  returnRequestInput: ReturnRequestInput
  sequenceNumber: string
  totalPrice: number
  status?: string
  refundedShippingValue: number
}

export const createReturnRequestFields = ({
  returnRequestInput,
  sequenceNumber,
  totalPrice,
  status = 'New',
  refundedShippingValue,
}: CreateReturnRequestFieldsArgs) => {
  return {
    ...returnRequestInput,
    sequenceNumber,
    totalPrice,
    status,
    type: 'request',
    dateSubmitted: new Date().toISOString(),
    refundedShippingValue,
  }
}

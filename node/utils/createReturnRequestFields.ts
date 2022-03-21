interface CreateReturnRequestFieldsArgs {
  returnRequestInput: ReturnRequestInput
  sequenceNumber: string
  totalPrice: number
  status?: string
}

export const createReturnRequestFields = ({
  returnRequestInput,
  sequenceNumber,
  totalPrice,
  status = 'New',
}: CreateReturnRequestFieldsArgs) => {
  return {
    ...returnRequestInput,
    sequenceNumber,
    totalPrice,
    status,
    type: 'request',
    dateSubmitted: new Date().toISOString(),
  }
}

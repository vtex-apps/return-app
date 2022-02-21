interface CreateStatusHistoryArgs {
  submittedBy: string
  refundId: string
  status?: string
}

export const createStatusHistoryFields = ({
  submittedBy,
  refundId,
  status = 'New',
}: CreateStatusHistoryArgs) => {
  return {
    submittedBy,
    refundId,
    status,
    dateSubmitted: new Date().toISOString(),
    type: 'statusHistory',
  }
}

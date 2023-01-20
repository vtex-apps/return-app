import { sendReturnLabelService } from '../services/sendReturnLabelService'

interface QuerySendReturnLabelArgs {
  requestId: string
  labelUrl: string
}

export const sendReturnLabel = async (
  _: unknown,
  args: QuerySendReturnLabelArgs,
  ctx: Context
) => {
  const { requestId, labelUrl } = args

  return sendReturnLabelService(ctx, requestId, labelUrl)
}

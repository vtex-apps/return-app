import { ResolverError, ForbiddenError } from '@vtex/api'
import type { AdjustmentNote } from 'odp.return-app'

export const adjustmentNoteService = async (
  ctx: Context,
  adjustmentId: string
) => {
  const {
    clients: { adjustmentNoteClient },
    state: { userProfile, appkey },
  } = ctx

  const { userId, role } = userProfile ?? {}
  const userIsAdmin = Boolean(appkey) || role === 'admin'

  const adjustmentNoteResult = await adjustmentNoteClient.get(adjustmentId, [
    '_all',
  ])

  if (!adjustmentNoteResult) {
    // Code error 'E_HTTP_404' to match the one when failing to find and order by OMS
    throw new ResolverError(
      `Request ${adjustmentId} not found`,
      404,
      'E_HTTP_404'
    )
  }

  const { customerProfileData } = adjustmentNoteResult as AdjustmentNote

  const requestBelongsToUser = userId === customerProfileData?.userId

  if (!requestBelongsToUser && !userIsAdmin) {
    throw new ForbiddenError('User cannot access this request')
  }

  return adjustmentNoteResult
}

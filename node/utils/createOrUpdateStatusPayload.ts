import { ResolverError } from '@vtex/api'
import type {
  Maybe,
  ReturnRequest,
  AdjustmentNote,
  ReturnRequestCommentInput,
  Status,
  AdjustmentNoteStatus,
} from 'odp.return-app'

export const createOrUpdateStatusPayload = ({
  refundStatusData,
  requestStatus,
  comment,
  submittedBy,
  createdAt,
}: {
  refundStatusData: ReturnRequest['refundStatusData']
  requestStatus: Status
  comment: Maybe<ReturnRequestCommentInput> | undefined
  submittedBy: string
  createdAt: string
}): ReturnRequest['refundStatusData'] => {
  if (!refundStatusData) {
    throw new ResolverError('Request does not have refundStatusData')
  }

  const newComment = comment
    ? {
        comment: comment.value,
        createdAt,
        submittedBy,
        visibleForCustomer: Boolean(comment.visibleForCustomer),
        role: 'adminUser' as const,
      }
    : null

  const hasRefundStatus = refundStatusData.find(
    ({ status }) => status === requestStatus
  )

  const statusPayload = hasRefundStatus
    ? refundStatusData.map((statusObject) => {
        if (statusObject.status !== requestStatus) return statusObject
        const updatedStatusObject = {
          ...statusObject,
          comments: [
            ...(statusObject?.comments ?? []),
            ...(newComment ? [newComment] : []),
          ],
        }

        return updatedStatusObject
      })
    : [
        ...refundStatusData,
        {
          status: requestStatus,
          submittedBy,
          createdAt,
          comments: [...(newComment ? [newComment] : [])],
        },
      ]

  return statusPayload
}

export const createOrUpdateAdjustmentStatusPayload = ({
  statusData,
  requestStatus,
  comment,
  submittedBy,
  createdAt,
}: {
  statusData: AdjustmentNote['statusData']
  requestStatus: AdjustmentNoteStatus
  comment: Maybe<ReturnRequestCommentInput> | undefined
  submittedBy: string
  createdAt: string
}): AdjustmentNote['statusData'] => {
  if (!statusData) {
    throw new ResolverError('Request does not have refundStatusData')
  }

  const newComment = comment
    ? {
        comment: comment.value,
        createdAt,
        submittedBy,
        visibleForCustomer: Boolean(comment.visibleForCustomer),
        role: 'adminUser' as const,
      }
    : null

  const hasRefundStatus = statusData.find(
    ({ status }) => status === requestStatus
  )

  const statusPayload = hasRefundStatus
    ? statusData.map((statusObject) => {
        if (statusObject.status !== requestStatus) return statusObject
        const updatedStatusObject = {
          ...statusObject,
          comments: [
            ...(statusObject?.comments ?? []),
            ...(newComment ? [newComment] : []),
          ],
        }

        return updatedStatusObject
      })
    : [
        ...statusData,
        {
          status: requestStatus,
          submittedBy,
          createdAt,
          comments: [...(newComment ? [newComment] : [])],
        },
      ]

  return statusPayload
}

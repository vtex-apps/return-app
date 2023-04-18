import type {
  Status,
  RefundStatusData,
  RefundStatusComment,
} from '../../typings/ReturnRequest'
import { defineMessages } from 'react-intl'

const statusSequence: Status[] = [
  'new',
  'processing',
  'pickedUpFromClient',
  'pendingVerification',
  'packageVerified',
  'amountRefunded',
]

export const statusAllowed: Record<Status, Status[]> = {
  new: ['new', 'processing', 'denied', 'cancelled'],
  processing: ['processing', 'pickedUpFromClient', 'denied', 'cancelled'],
  pickedUpFromClient: ['pickedUpFromClient', 'pendingVerification', 'denied'],
  // In this step, when sending the items to the resolver, it will assign the status denied or packageVerified based on the items sent.
  pendingVerification: ['pendingVerification'],
  packageVerified: ['packageVerified', 'amountRefunded'],
  amountRefunded: ['amountRefunded'],
  denied: ['denied'],
  cancelled: ['cancelled'],
}

export const statusMessageIdAdmin = defineMessages({
  new: { id: 'return-app-status.new' },
  processing: { id: 'return-app-status.processing' },
  pickedUpFromClient: { id: 'return-app-status.pickedup-from-client' },
  pendingVerification: { id: 'return-app-status.pending-verification' },
  packageVerified: { id: 'return-app-status.package-verified' },
  amountRefunded: { id: 'return-app-status.refunded' },
  denied: { id: 'return-app-status.denied' },
  cancelled: { id: 'return-app-status.cancelled' },
})

export const timelineStatusMessageId = defineMessages({
  new: { id: 'return-app-status.timeline.new' },
  processing: { id: 'return-app-status.timeline.processing' },
  pickedUpFromClient: {
    id: 'return-app-status.timeline.pickedup-from-client',
  },
  pendingVerification: {
    id: 'return-app-status.timeline.pending-verification',
  },
  packageVerified: { id: 'return-app-status.timeline.package-verified' },
  amountRefunded: { id: 'return-app-status.timeline.refunded' },
  denied: { id: 'return-app-status.timeline.denied' },
  cancelled: { id: 'return-app-status.timeline.cancelled' },
})

type Comments = RefundStatusComment[]
interface VisitedStatus {
  status: Status
  visited: boolean
  comments?: Comments
  createdAt?: string
  submittedBy?: string | null
}

export const createStatusTimeline = (
  currentStatus: Status,
  refundStatusData: RefundStatusData[]
): VisitedStatus[] => {
  const refundStatusMap = new Map<Status, VisitedStatus>()

  for (const status of refundStatusData ?? []) {
    const { status: statusName, comments, createdAt, submittedBy } = status

    refundStatusMap.set(statusName as Status, {
      status: statusName as Status,
      visited: true,
      comments,
      createdAt,
      submittedBy,
    })
  }

  const statusTimeline: VisitedStatus[] = []

  const isDenied = currentStatus === 'denied'
  const isCancelled = currentStatus === 'cancelled'

  for (const statusName of statusSequence) {
    const status = refundStatusMap.get(statusName)

    if (!status && !isDenied && !isCancelled) {
      statusTimeline.push({ status: statusName, visited: false })
      continue
    }

    if (status) {
      statusTimeline.push(status as VisitedStatus)
    }
  }

  if (isDenied || isCancelled) {
    const status = refundStatusMap.get(isDenied ? 'denied' : 'cancelled')

    if (status) {
      statusTimeline.push(status)
    }
  }

  return statusTimeline
}

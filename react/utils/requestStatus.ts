import type {
  Status,
  RefundStatusData,
  RefundStatusComment,
} from 'vtex.return-app'
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
  new: ['new', 'processing', 'denied'],
  processing: ['processing', 'pickedUpFromClient', 'denied'],
  pickedUpFromClient: ['pickedUpFromClient', 'pendingVerification', 'denied'],
  // In this step, when sending the items to the resolver, it will assign the status denied or packageVerified based on the items sent.
  pendingVerification: ['pendingVerification'],
  packageVerified: ['packageVerified', 'amountRefunded'],
  amountRefunded: ['amountRefunded'],
  denied: ['denied'],
}

export const statusMessageIdAdmin = defineMessages({
  new: { id: 'admin/return-app-status.new' },
  processing: { id: 'admin/return-app-status.processing' },
  pickedUpFromClient: { id: 'admin/return-app-status.pickedup-from-client' },
  pendingVerification: { id: 'admin/return-app-status.pending-verification' },
  packageVerified: { id: 'admin/return-app-status.package-verified' },
  amountRefunded: { id: 'admin/return-app-status.refunded' },
  denied: { id: 'admin/return-app-status.denied' },
})

export const timelineStatusMessageId = defineMessages({
  new: { id: 'admin/return-app-status.timeline.new' },
  processing: { id: 'admin/return-app-status.timeline.processing' },
  pickedUpFromClient: {
    id: 'admin/return-app-status.timeline.pickedup-from-client',
  },
  pendingVerification: {
    id: 'admin/return-app-status.timeline.pending-verification',
  },
  packageVerified: { id: 'admin/return-app-status.timeline.package-verified' },
  amountRefunded: { id: 'admin/return-app-status.timeline.refunded' },
  denied: { id: 'admin/return-app-status.timeline.denied' },
})

type Comments = RefundStatusComment[]
interface VisitedStatus {
  status: Status
  visited: boolean
  comments?: Comments
  createdAt?: string
  submittedBy?: string
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

  for (const statusName of statusSequence) {
    const status = refundStatusMap.get(statusName)

    if (!status && !isDenied) {
      statusTimeline.push({ status: statusName, visited: false })
      continue
    }

    if (status) {
      statusTimeline.push(status as VisitedStatus)
    }
  }

  if (isDenied) {
    const status = refundStatusMap.get('denied')

    if (status) {
      statusTimeline.push(status)
    }
  }

  return statusTimeline
}

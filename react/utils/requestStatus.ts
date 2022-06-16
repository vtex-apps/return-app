import type {
  Status,
  RefundStatusData,
  RefundStatusComment,
} from 'vtex.return-app'

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

export const statusMessageIdAdmin: Record<Status, string> = {
  new: 'admin/return-app-status.new',
  processing: 'admin/return-app-status.processing',
  pickedUpFromClient: 'admin/return-app-status.pickedup-from-client',
  pendingVerification: 'admin/return-app-status.pending-verification',
  packageVerified: 'admin/return-app-status.package-verified',
  amountRefunded: 'admin/return-app-status.refunded',
  denied: 'admin/return-app-status.denied',
}

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

import { ResolverError, UserInputError } from '@vtex/api'
import type { Status } from '../../typings/ReturnRequest'

const statusAllowed: Record<Status, Status[]> = {
  new: ['new', 'processing', 'denied', 'cancelled'],
  processing: ['processing', 'pickedUpFromClient', 'denied', 'cancelled'],
  pickedUpFromClient: ['pickedUpFromClient', 'pendingVerification', 'denied'],
  pendingVerification: ['pendingVerification', 'packageVerified'],
  // In this step, when sending the items to the resolver, it will assign the status denied or packageVerified based on the items sent.
  packageVerified: ['packageVerified', 'amountRefunded'],
  amountRefunded: ['amountRefunded'],
  denied: ['denied'],
  cancelled: ['cancelled'],
}

export const validateStatusUpdate = (
  newStatus: Status,
  currentStatus: Status
) => {
  if (!newStatus) {
    throw new UserInputError('Missing status')
  }

  if (!statusAllowed[newStatus]) {
    throw new UserInputError(
      `Invalid status: ${newStatus}. Valid values: ${Object.keys(
        statusAllowed
      ).join(', ')}`
    )
  }

  if (!statusAllowed[currentStatus].includes(newStatus)) {
    throw new ResolverError(
      `Status transition from ${currentStatus} to ${newStatus} is not allowed. Valid status: ${statusAllowed[
        currentStatus
      ].join(', ')}`
    )
  }
}

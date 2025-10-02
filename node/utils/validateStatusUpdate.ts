import { ResolverError, UserInputError } from '@vtex/api'
import type {
  AdjustmentNoteStatus,
  AdjustmentNoteType,
  Status,
} from 'odp.return-app'

const statusAllowed: Record<Status, Status[]> = {
  new: ['new', 'processing', 'denied', 'cancelled'],
  processing: [
    'processing',
    'pickedUpFromClient',
    'pendingVerification',
    'packageVerified',
    'denied',
    'cancelled',
  ],
  pickedUpFromClient: [
    'pickedUpFromClient',
    'pendingVerification',
    'packageVerified',
    'denied',
  ],
  pendingVerification: ['pendingVerification', 'packageVerified'],
  // In this step, when sending the items to the resolver, it will assign the status denied or packageVerified based on the items sent.
  packageVerified: ['packageVerified', 'amountRefunded', 'cancelled'],
  amountRefunded: ['amountRefunded'],
  denied: ['denied'],
  cancelled: ['cancelled'],
}

const statusAllowedAdjustmentNote: Record<
  AdjustmentNoteStatus,
  AdjustmentNoteStatus[]
> = {
  pending: ['pending', 'authorized', 'denied', 'cancelled'],
  authorized: ['authorized', 'refunded', 'charged', 'denied', 'cancelled'],
  refunded: ['refunded'],
  charged: ['charged'],
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

export const validateAdjustmentStatusUpdate = (
  newStatus: AdjustmentNoteStatus,
  currentStatus: AdjustmentNoteStatus,
  type: AdjustmentNoteType
) => {
  if (!newStatus) {
    throw new UserInputError('Missing status')
  }

  if (!statusAllowedAdjustmentNote[newStatus]) {
    throw new UserInputError(
      `Invalid status: ${newStatus}. Valid values: ${Object.keys(
        statusAllowedAdjustmentNote
      ).join(', ')}`
    )
  }

  if (!statusAllowedAdjustmentNote[currentStatus].includes(newStatus)) {
    throw new ResolverError(
      `Status transition from ${currentStatus} to ${newStatus} is not allowed. Valid status: ${statusAllowedAdjustmentNote[
        currentStatus
      ].join(', ')}`
    )
  }

  if (newStatus === 'refunded' && type === 'debitNote') {
    throw new UserInputError(
      'Invalid status refunded for debit notes, please use the status charged instead.'
    )
  }

  if (newStatus === 'charged' && type === 'creditNote') {
    throw new UserInputError(
      'Invalid status charged for credit notes, please use the status refunded instead.'
    )
  }
}

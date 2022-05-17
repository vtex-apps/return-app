import { ResolverError } from '@vtex/api'
import type { Status } from 'vtex.return-app'

const previousStatusAllowed: Record<Status, Status[]> = {
  new: ['new'],
  processing: ['new', 'processing'],
  pickedUpFromClient: ['processing', 'pickedUpFromClient'],
  pendingVerification: ['pickedUpFromClient', 'pendingVerification'],
  packageVerified: ['pendingVerification', 'packageVerified'],
  amountRefunded: ['packageVerified', 'amountRefunded'],
  denied: [
    'new',
    'processing',
    'pickedUpFromClient',
    'pendingVerification',
    'denied',
  ],
}

export const validateStatusUpdate = (
  newStatus: Status,
  currentStatus: Status
) => {
  if (!previousStatusAllowed[newStatus].includes(currentStatus)) {
    throw new ResolverError(
      `Status transition from ${currentStatus} to ${newStatus} is not allowed`
    )
  }
}

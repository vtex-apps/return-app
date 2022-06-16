import type { Status } from 'vtex.return-app'

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

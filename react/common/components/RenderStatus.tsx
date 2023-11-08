import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  IconClock,
  IconFailure,
  IconVisibilityOn,
  IconCheck,
  IconSuccess,
  IconExternalLinkMini,
} from 'vtex.styleguide'

import type { Status } from '../../../typings/ReturnRequest'

const status = {
  new: 'new',
  processing: 'processing',
  picked: 'pickedUpFromClient',
  pendingVerification: 'pendingVerification',
  verified: 'packageVerified',
  denied: 'denied',
  refunded: 'amountRefunded',
  canceled: 'canceled',
} as const

/**
 * Renders the status with an icon and color
 */
export function renderStatus(requestStatus: Status) {
  switch (requestStatus) {
    case status.verified:
      return (
        <div className="green flex items-center">
          <span className="mr2 flex">
            <IconSuccess size={14} />
          </span>
          <FormattedMessage id="return-app.return-request-list.table.status.package-verified" />
        </div>
      )

    case status.denied:
      return (
        <div className="red flex items-center">
          <span className="mr2 flex">
            <IconFailure size={14} />
          </span>
          <FormattedMessage id="return-app.return-request-list.table.status.denied" />
        </div>
      )

    case status.canceled:
      return (
        <div className="red flex items-center">
          <span className="mr2 flex">
            <IconFailure size={14} />
          </span>
          <FormattedMessage id="return-app.return-request-list.table.status.canceled" />
        </div>
      )

    case status.pendingVerification:
      return (
        <div className="yellow flex items-center">
          <span className="mr2 flex">
            <IconClock size={14} />
          </span>
          <FormattedMessage id="return-app.return-request-list.table.status.pending-verification" />
        </div>
      )

    case status.processing:
      return (
        <div className="yellow flex items-center">
          <span className="mr2 flex">
            <IconClock size={14} />
          </span>
          <FormattedMessage id="return-app.return-request-list.table.status.processing" />
        </div>
      )

    case status.refunded:
      return (
        <div className="green flex items-center">
          <span className="mr2 flex">
            <IconCheck size={14} />
          </span>
          <FormattedMessage id="return-app.return-request-list.table.status.refunded" />
        </div>
      )

    case status.picked:
      return (
        <div className="flex items-center">
          <span className="mr2 flex">
            <IconExternalLinkMini size={11} />
          </span>
          <FormattedMessage id="return-app.return-request-list.table.status.pickedup-from-client" />
        </div>
      )

    default:
      return (
        <div className="light-marine flex items-center">
          <span className="mr2 flex">
            <IconVisibilityOn size={14} />
          </span>
          <FormattedMessage id="return-app.return-request-list.table.status.new" />
        </div>
      )
  }
}

import React from 'react'
import {
  IconFailure,
  IconSuccess,
  IconWarning,
  IconClock,
} from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import type { ItemStatusInterface } from './ItemDetailsList'

export const ItemVerificationStatus = (props: ItemStatusInterface) => {
  const { status, quantity, quantityRefunded } = props

  switch (status) {
    case 'denied': {
      return (
        <div className="c-danger flex items-center">
          <span className="mr2 flex">
            <IconFailure size={14} />
          </span>
          <FormattedMessage id="return-app.return-request-details.table.verification-status.denied" />
        </div>
      )
    }

    case 'approved': {
      return (
        <div className="c-success flex items-center">
          <span className="mr2 flex">
            <IconSuccess size={14} />
          </span>
          <FormattedMessage id="return-app.return-request-details.table.verification-status.approved" />
        </div>
      )
    }

    case 'partiallyApproved': {
      return (
        <div className="c-warning flex items-center">
          <span className="mr2 flex">
            <IconWarning size={14} />
          </span>
          <FormattedMessage
            id="return-app.return-request-details.table.verification-status.partially-approved"
            values={{ quantityRefunded, quantity }}
          />
        </div>
      )
    }

    default: {
      return (
        <div className="c-warning flex items-center">
          <span className="mr2 flex">
            <IconClock size={14} />
          </span>
          <FormattedMessage id="return-app.return-request-details.table.verification-status.new" />
        </div>
      )
    }
  }
}

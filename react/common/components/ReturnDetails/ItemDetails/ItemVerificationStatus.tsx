import React from 'react'
import {
  IconFailure,
  IconSuccess,
  IconWarning,
  IconClock,
} from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import type { ItemStatusInterface } from './ItemDetailsList'

const CSS_HANDLES = [
  'itemVerificationDeniedContainer',
  'itemVerificationApprovedContainer',
  'itemVerificationPartiallyContainer',
  'itemVerificationNewContainer',
] as const

export const ItemVerificationStatus = (props: ItemStatusInterface) => {
  const { status, quantity, quantityRefunded } = props
  const handles = useCssHandles(CSS_HANDLES)

  switch (status) {
    case 'denied': {
      return (
        <div
          className={`${handles.itemVerificationDeniedContainer} c-danger flex items-center`}
        >
          <span className="mr2 flex">
            <IconFailure size={14} />
          </span>
          <FormattedMessage id="store/return-app.return-request-details.table.verification-status.denied" />
        </div>
      )
    }

    case 'approved': {
      return (
        <div
          className={`${handles.itemVerificationApprovedContainer} c-success flex items-center`}
        >
          <span className="mr2 flex">
            <IconSuccess size={14} />
          </span>
          <FormattedMessage id="store/return-app.return-request-details.table.verification-status.approved" />
        </div>
      )
    }

    case 'partiallyApproved': {
      return (
        <div
          className={`${handles.itemVerificationPartiallyContainer} c-warning flex items-center`}
        >
          <span className="mr2 flex">
            <IconWarning size={14} />
          </span>
          <FormattedMessage
            id="store/return-app.return-request-details.table.verification-status.partially-approved"
            values={{ quantityRefunded, quantity }}
          />
        </div>
      )
    }

    default: {
      return (
        <div
          className={`${handles.itemVerificationNewContainer} c-warning flex items-center`}
        >
          <span className="mr2 flex">
            <IconClock size={14} />
          </span>
          <FormattedMessage id="store/return-app.return-request-details.table.verification-status.new" />
        </div>
      )
    }
  }
}

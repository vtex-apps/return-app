import React from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import {
  IconClock,
  IconFailure,
  IconVisibilityOn,
  IconCheck,
  IconSuccess,
  IconExternalLinkMini,
  ButtonPlain,
} from 'vtex.styleguide'
import type { Status } from 'vtex.return-app'

const status = {
  new: 'new',
  processing: 'processing',
  picked: 'pickedUpFromClient',
  pendingVerification: 'pendingVerification',
  verified: 'packageVerified',
  denied: 'denied',
  refunded: 'amountRefunded',
} as const

const ReturnListSchema = () => {
  const { navigate } = useRuntime()

  const navigateToRequest = (id: string) => {
    navigate({
      to: `/admin/app/returns/${id}/details`,
    })
  }

  return {
    properties: {
      id: {
        title: (
          <FormattedMessage id="return-app.return-request-list.table-data.requestId" />
        ),
        minWidth: 310,
        cellRenderer({ cellData }) {
          return (
            <ButtonPlain
              size="small"
              onClick={() => navigateToRequest(cellData)}
            >
              {cellData}
            </ButtonPlain>
          )
        },
      },
      sequenceNumber: {
        title: (
          <FormattedMessage id="return-app.return-request-list.table-data.sequenceNumber" />
        ),
      },
      orderId: {
        title: (
          <FormattedMessage id="return-app.return-request-list.table-data.orderId" />
        ),
      },
      createdIn: {
        title: (
          <FormattedMessage id="return-app.return-request-list.table-data.createdDate" />
        ),
        cellRenderer({ cellData }) {
          return <FormattedDate value={cellData} />
        },
      },
      status: {
        title: (
          <FormattedMessage id="return-app.return-request-list.table-data.status" />
        ),
        cellRenderer({ cellData }) {
          return (
            <div className="flex items-center">{renderStatus(cellData)}</div>
          )
        },
      },
    },
  }
}

/**
 * Renders the status with an icon and color
 */
function renderStatus(requestStatus: Status) {
  switch (requestStatus) {
    case status.verified:
      return (
        <span className="green">
          <IconSuccess size={14} />{' '}
          <FormattedMessage id="admin/return-app-status.package-verified" />
        </span>
      )

    case status.denied:
      return (
        <span className="red">
          <IconFailure size={14} />{' '}
          <FormattedMessage id="admin/return-app-status.denied" />
        </span>
      )

    case status.pendingVerification:
      return (
        <span className="yellow">
          <IconClock size={14} />{' '}
          <FormattedMessage id="admin/return-app-status.pending-verification" />
        </span>
      )

    case status.processing:
      return (
        <span className="yellow">
          <IconClock size={14} />{' '}
          <FormattedMessage id="admin/return-app-status.processing" />
        </span>
      )

    case status.refunded:
      return (
        <span className="green">
          <IconCheck size={14} />{' '}
          <FormattedMessage id="admin/return-app-status.refunded" />
        </span>
      )

    case status.picked:
      return (
        <span>
          <IconExternalLinkMini size={11} />{' '}
          <FormattedMessage id="admin/return-app-status.picked" />
        </span>
      )

    default:
      return (
        <span className="light-marine">
          <IconVisibilityOn size={14} />{' '}
          <FormattedMessage id="admin/return-app-status.new" />
        </span>
      )
  }
}

export default ReturnListSchema

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
          return (
            <FormattedDate
              value={cellData}
              day="numeric"
              month="long"
              year="numeric"
            />
          )
        },
      },
      status: {
        title: (
          <FormattedMessage id="return-app.return-request-list.table-data.status" />
        ),
        cellRenderer({ cellData }) {
          return renderStatus(cellData)
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
        <div className="green flex items-center">
          <span className="mr2 flex">
            <IconSuccess size={14} />
          </span>
          <FormattedMessage id="admin/return-app-status.package-verified" />
        </div>
      )

    case status.denied:
      return (
        <div className="red flex items-center">
          <span className="mr2 flex">
            <IconFailure size={14} />
          </span>
          <FormattedMessage id="admin/return-app-status.denied" />
        </div>
      )

    case status.pendingVerification:
      return (
        <div className="yellow flex items-center">
          <span className="mr2 flex">
            <IconClock size={14} />
          </span>
          <FormattedMessage id="admin/return-app-status.pending-verification" />
        </div>
      )

    case status.processing:
      return (
        <div className="yellow flex items-center">
          <span className="mr2 flex">
            <IconClock size={14} />
          </span>
          <FormattedMessage id="admin/return-app-status.processing" />
        </div>
      )

    case status.refunded:
      return (
        <div className="green flex items-center">
          <span className="mr2 flex">
            <IconCheck size={14} />
          </span>
          <FormattedMessage id="admin/return-app-status.refunded" />
        </div>
      )

    case status.picked:
      return (
        <div className="flex items-center">
          <span className="mr2 flex">
            <IconExternalLinkMini size={11} />
          </span>
          <FormattedMessage id="admin/return-app-status.picked" />
        </div>
      )

    default:
      return (
        <div className="light-marine flex items-center">
          <span className="mr2 flex">
            <IconVisibilityOn size={14} />
          </span>
          <FormattedMessage id="admin/return-app-status.new" />
        </div>
      )
  }
}

export default ReturnListSchema

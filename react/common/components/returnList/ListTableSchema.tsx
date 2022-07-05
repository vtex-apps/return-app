import React from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import {
  IconClock,
  IconFailure,
  IconVisibilityOn,
  IconCheck,
  IconInfo,
  IconSuccess,
  IconExternalLinkMini,
  ButtonPlain,
  Tooltip,
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
  const { navigate, route } = useRuntime()

  const adminDomain = route.domain === 'admin'

  const navigateToRequest = (id: string) => {
    const page = adminDomain
      ? `/admin/app/returns/${id}/details/`
      : `#/my-returns/details/${id}`

    navigate({
      to: page,
    })
  }

  return {
    properties: {
      ...(adminDomain && {
        id: {
          title: (
            <FormattedMessage id="return-app.return-request-list.table-data.requestId" />
          ),
          headerRenderer({ title }) {
            return (
              <div className="flex items-center">
                {title}
                <Tooltip
                  label={
                    <FormattedMessage id="admin/return-app.return-request-list.table-data.requestId.tooltip" />
                  }
                >
                  <span className="yellow pointer ml3 flex">
                    <IconInfo />
                  </span>
                </Tooltip>
              </div>
            )
          },
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
      }),
      sequenceNumber: {
        title: (
          <FormattedMessage id="return-app.return-request-list.table-data.sequenceNumber" />
        ),
        ...(!adminDomain && {
          cellRenderer({ cellData, rowData }) {
            return (
              <ButtonPlain onClick={() => navigateToRequest(rowData.id)}>
                {cellData}
              </ButtonPlain>
            )
          },
        }),
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
          <FormattedMessage id="return-app.return-request-list.table.status.picked" />
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

export default ReturnListSchema

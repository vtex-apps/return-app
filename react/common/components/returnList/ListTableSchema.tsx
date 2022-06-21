import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  IconClock,
  IconFailure,
  IconSuccess,
  IconVisibilityOn,
  IconCheck,
  IconExternalLinkMini,
} from 'vtex.styleguide'

const status = {
  new: 'New',
  processing: 'Processing',
  picked: 'Picked up from client',
  pendingVerification: 'Pending verification',
  approved: 'Approved',
  denied: 'Denied',
  refunded: 'Refunded',
} as const

const ReturnListSchema = () => {
  return {
    properties: {
      id: {
        title: <FormattedMessage id="returns.requestId" />,
        minWidth: 350,
      },
      sequenceNumber: {
        title: <FormattedMessage id="returns.sequenceNumber" />,
        width: 150,
      },
      orderId: {
        title: <FormattedMessage id="returns.orderId" />,
      },
      createdIn: {
        title: <FormattedMessage id="returns.submittedDate" />,
        cellRenderer: ({ cellData }) => {
          return new Date(cellData).toLocaleString()
        },
      },
      status: {
        title: <FormattedMessage id="returns.status" />,
        // eslint-disable-next-line react/display-name
        cellRenderer: ({ cellData }) => {
          return <div>{renderIcon(cellData.status)}</div>
        },
      },
    },
  }
}

function renderIcon(requestStatus: any) {
  switch (requestStatus) {
    case status.approved:
      return (
        <span className="green">
          <IconSuccess size={14} />{' '}
          <FormattedMessage id="admin/return-app-status.approved" />
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

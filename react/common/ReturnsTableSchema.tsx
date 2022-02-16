import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, IconVisibilityOn, IconGrid } from 'vtex.styleguide'

import { beautifyDate, renderStatusIcon } from './utils'

type ReturnsTableSchemaProps = {
  handleViewRequest: (requestId: string) => void
  navigator: (to: { to: string }) => void
}
const returnsTableSchema = ({
  navigator,
  handleViewRequest,
}: ReturnsTableSchemaProps) => {
  return {
    properties: {
      id: {
        title: <FormattedMessage id="returns.requestId" />,
        sortable: true,
        width: 350,
      },
      sequenceNumber: {
        title: <FormattedMessage id="returns.sequenceNumber" />,
        sortable: true,
      },
      orderId: {
        title: <FormattedMessage id="returns.orderId" />,
        sortable: true,
      },
      dateSubmitted: {
        title: <FormattedMessage id="returns.submittedDate" />,
        cellRenderer: ({ cellData }) => {
          return beautifyDate(cellData)
        },
        sortable: true,
      },
    },
  }
}

export default returnsTableSchema

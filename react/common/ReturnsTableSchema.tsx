import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, IconVisibilityOn, IconGrid } from 'vtex.styleguide'

import { beautifyDate, renderStatusIcon } from './utils'

type ReturnsTableSchemaProps = {
  handleViewRequest: (requestId: string) => void
  navigate: (to: { to: string }) => void
}
const ReturnsTableSchema = ({
  navigate,
  handleViewRequest,
}: ReturnsTableSchemaProps) => {
  return {
    properties: {
      id: {
        title: <FormattedMessage id="returns.requestId" />,
        sortable: true,
        width: 320,
      },
      sequenceNumber: {
        title: <FormattedMessage id="returns.sequenceNumber" />,
        width: 150,
        sortable: false,
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
      status: {
        title: <FormattedMessage id="returns.status" />,
        sortable: true,
        // eslint-disable-next-line react/display-name
        cellRenderer: ({ cellData }) => {
          return <div>{renderStatusIcon(cellData)}</div>
        },
      },
      actions: {
        title: <FormattedMessage id="returns.actions" />,
        // eslint-disable-next-line react/display-name
        cellRenderer: ({ rowData }) => {
          return (
            <div>
              <Button
                variation="tertiary"
                onClick={() => {
                  handleViewRequest(rowData.id)
                }}
              >
                <IconGrid />
              </Button>
              <Button
                variation="tertiary"
                onClick={() => {
                  navigate({
                    to: `/admin/app/returns/${rowData.id}/details`,
                  })
                }}
              >
                <IconVisibilityOn />
              </Button>
            </div>
          )
        },
      },
    },
  }
}

export default ReturnsTableSchema

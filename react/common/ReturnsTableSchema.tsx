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
        cellRenderer: ({ cellData }): any => {
          return beautifyDate(cellData)
        },
        sortable: true,
      },
      status: {
        title: <FormattedMessage id="returns.status" />,
        sortable: true,
        width: 200,
        cellRenderer: ({ cellData }): any => {
          return renderStatusIcon(cellData)
        },
      },
      actions: {
        width: 150,
        title: <FormattedMessage id="returns.actions" />,
        // eslint-disable-next-line react/display-name
        cellRenderer: ({ rowData }): any => {
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
                  navigator({
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

export default returnsTableSchema

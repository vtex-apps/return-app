import React from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { IconInfo, ButtonPlain, Tooltip } from 'vtex.styleguide'

import { renderStatus } from '../RenderStatus'

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
      dateSubmitted: {
        title: (
          <FormattedMessage id="return-app.return-request-list.table-data.createdDate" />
        ),
        cellRenderer({ cellData }) {
          return (
            <FormattedDate
              value={cellData}
              day="2-digit"
              month="2-digit"
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

export default ReturnListSchema

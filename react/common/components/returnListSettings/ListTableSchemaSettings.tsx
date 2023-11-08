import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { ButtonPlain } from 'vtex.styleguide'

const ReturnListTableSchemaSettings = () => {
  const {
    navigate,
    route: { domain },
  } = useRuntime()

  const isAdmin = domain === 'admin'

  const navigateToRequest = (id: string) => {
    const page = isAdmin
      ? `/admin/app/returns/sellers/settings/${id}/details/ `
      : `#/my-returns/details/${id}`

    navigate({
      to: page,
    })
  }

  return {
    properties: {
      ...(isAdmin && {
        sellerId: {
          title: (
            <FormattedMessage id="return-app.return-request-list.table-data.sellerName" />
          ),
          minWidth: 140,
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
        id: {
          title: (
            <FormattedMessage id="return-app.sellers-settings-list.table-data.settingId" />
          ),
          minWidth: 310,
          headerRenderer({ title }) {
            return <div className="flex items-center">{title}</div>
          },
        },
      }),
    },
  }
}

export default ReturnListTableSchemaSettings

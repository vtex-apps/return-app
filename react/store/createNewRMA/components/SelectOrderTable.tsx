import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Table } from 'vtex.styleguide'

const tableSchema = {
  properties: {
    orderId: {
      title: (
        <FormattedMessage id="store/return-app.return-order-list.table-id" />
      ),
    },
    creationDate: {
      title: (
        <FormattedMessage id="store/return-app.return-order-list.table-creationDate" />
      ),
    },
    status: {
      title: (
        <FormattedMessage id="store/return-app.return-order-list.table-status" />
      ),
    },
    selectOrder: {
      title: (
        <FormattedMessage id="store/return-app.return-order-list.table-selectOrder" />
      ),
    },
  },
}

export const SelectOrderTable = () => {
  return (
    <div>
      <Table fullWidth schema={tableSchema} />
    </div>
  )
}

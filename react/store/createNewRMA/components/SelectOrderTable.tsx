import React, { useState } from 'react'
import { FormattedMessage, FormattedDate } from 'react-intl'
import { Table, Button } from 'vtex.styleguide'
import type { OrdersToReturnList } from 'vtex.return-app'

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
      cellRenderer: function formatDate({ cellData }: { cellData: string }) {
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
        <FormattedMessage id="store/return-app.return-order-list.table-status" />
      ),
    },
    selectOrder: {
      title: (
        <FormattedMessage id="store/return-app.return-order-list.table-selectOrder" />
      ),
      cellRenderer: function selectOrderButton({ rowData }) {
        // eslint-disable-next-line no-console
        console.log(rowData)

        return (
          <Button size="small">
            <FormattedMessage id="store/return-app.return-order-list.table-selectOrder" />
          </Button>
        )
      },
    },
  },
}

interface Props {
  orders: OrdersToReturnList
}

export const SelectOrderTable = ({ orders }: Props) => {
  const [paginationState, setPaginationState] = useState({
    page: 1,
    pageSize: 5,
  })

  const { paging } = orders

  const handleNextClick = () => {
    const newPage = paginationState.page + 1

    setPaginationState({
      ...paginationState,
      page: newPage,
    })
  }

  const handlePrevClick = () => {
    if (paginationState.page === 1) return

    const newPage = paginationState.page - 1

    setPaginationState({
      ...paginationState,
      page: newPage,
    })
  }

  const perPage = paging?.perPage ?? 0
  const currentPage = paging?.currentPage ?? 1
  const totalItems = paging?.total ?? 0

  return (
    <div>
      <Table
        fullWidth
        schema={tableSchema}
        items={orders.list}
        pagination={{
          onNextClick: handleNextClick,
          onPrevClick: handlePrevClick,
          currentItemFrom: perPage * currentPage - perPage + 1,
          currentItemTo:
            perPage * currentPage > totalItems
              ? totalItems
              : perPage * currentPage,
          textShowRows: 'Show rows',
          textOf: 'of',
          totalItems,
        }}
      />
    </div>
  )
}

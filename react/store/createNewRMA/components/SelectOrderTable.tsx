import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import { FormattedMessage, FormattedDate } from 'react-intl'
import { Table, Button } from 'vtex.styleguide'

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

export const SelectOrderTable = ({ orders }) => {
  const [paginationState, setPaginationState] = useState({
    page: 1,
    pageSize: 5,
  })

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

  const handleRowsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e

    setPaginationState({
      page: 1,
      pageSize: +value,
    })
  }

  return (
    <div>
      <Table
        fullWidth
        schema={tableSchema}
        items={orders.list}
        pagination={{
          onNextClick: handleNextClick,
          onPrevClick: handlePrevClick,
          onRowsChange: handleRowsChange,
          currentItemFrom:
            orders.paging.perPage * orders.paging.currentPage -
            orders.paging.perPage,
          currentItemTo:
            orders.paging.perPage * orders.paging.currentPage >
            orders.paging.total
              ? orders.paging.total
              : orders.paging.perPage * orders.paging.currentPage,
          textShowRows: 'Show rows',
          textOf: 'of',
          totalItems: orders.paging.total,
          rowsOptions: [orders.paging.perPage],
        }}
      />
    </div>
  )
}

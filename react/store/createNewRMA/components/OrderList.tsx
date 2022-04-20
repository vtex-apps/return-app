import React, { useState } from 'react'
import { Link } from 'vtex.render-runtime'
import type { OrdersToReturnList } from 'vtex.return-app'
import { FormattedMessage, FormattedDate } from 'react-intl'
import { Table } from 'vtex.styleguide'

import { productsStatusToReturn } from '../../utils/filterProductStatus'

interface Props {
  orders: OrdersToReturnList
  handlePagination: (
    page: number,
    operation: 'next' | 'previous'
  ) => Promise<void>
}

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
      cellRenderer: function isActive({ rowData }) {
        const message = productsStatusToReturn(rowData)

        return <p>{message}</p>
      },
    },
    selectOrder: {
      title: (
        <FormattedMessage id="store/return-app.return-order-list.table-selectOrder" />
      ),
      cellRenderer: function selectOrderButton({ rowData }) {
        return (
          <Link
            to={`#/my-returns/add/${rowData.orderId}`}
            className="pointer c-link active-c-link no-underline bg-transparent b--transparent c-action-primary hover-b--transparent hover-bg-action-secondary hover-b--action-secondary t-action br2 pa3-s"
          >
            <FormattedMessage id="store/return-app.return-order-list.table-selectOrder" />
          </Link>
        )
      },
    },
  },
}

export const OrderList = ({ orders, handlePagination }: Props) => {
  const [fetchMoreState, setFetchMoreState] = useState<'IDLE' | 'LOADING'>(
    'IDLE'
  )

  const { paging } = orders
  const currentPage = paging?.currentPage ?? 1
  const perPage = paging?.perPage ?? 0
  const totalItems = paging?.total ?? 0

  const handleNextClick = async () => {
    const newPage = currentPage + 1

    setFetchMoreState('LOADING')
    await handlePagination(newPage, 'next')
    setFetchMoreState('IDLE')
  }

  const handlePrevClick = async () => {
    if (currentPage === 1) return
    const newPage = currentPage - 1

    setFetchMoreState('LOADING')
    await handlePagination(newPage, 'previous')
    setFetchMoreState('IDLE')
  }

  return (
    <Table
      fullWidth
      schema={tableSchema}
      items={orders.list}
      loading={fetchMoreState === 'LOADING'}
      pagination={{
        onNextClick: handleNextClick,
        onPrevClick: handlePrevClick,
        currentItemFrom: perPage * currentPage - perPage + 1,
        currentItemTo:
          perPage * currentPage > totalItems
            ? totalItems
            : perPage * currentPage,
        textOf: 'of',
        totalItems,
      }}
    />
  )
}

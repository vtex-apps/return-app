import React, { useState } from 'react'
import type { OrdersToReturnList, OrderToReturnSummary } from 'vtex.return-app'
import { FormattedMessage, FormattedDate } from 'react-intl'
import { Table, Button } from 'vtex.styleguide'

import { createItemsSummary } from '../../utils/createItemsSummary'

type Operation = 'next' | 'previous'
interface Props {
  orders: OrdersToReturnList
  handlePagination: (page: number, operation: Operation) => Promise<void>
}

interface RowData {
  rowData: OrderToReturnSummary
}

const tableSchema = {
  properties: {
    orderId: {
      title: (
        <FormattedMessage id="store/return-app.return-order-list.table-header.oder-id" />
      ),
    },
    creationDate: {
      title: (
        <FormattedMessage id="store/return-app.return-order-list.table-header.creation-date" />
      ),
      cellRenderer: function formatDate({ cellData }: { cellData: string }) {
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
        <FormattedMessage id="store/return-app.return-order-list.table-header.items-to-return" />
      ),
      cellRenderer: function availableProducts({ rowData }: RowData) {
        const { quantityAvailable, quantity } = createItemsSummary(rowData)

        return <p>{`${quantityAvailable} / ${quantity}`}</p>
      },
    },
    selectOrder: {
      title: (
        <FormattedMessage id="store/return-app.return-order-list.table-header.select-order" />
      ),
      cellRenderer: function selectOrderButton({ rowData }: RowData) {
        const { quantityAvailable } = createItemsSummary(rowData)

        return (
          <div>
            <Button
              {...(quantityAvailable
                ? null
                : { href: `#/my-returns/add/${rowData.orderId}` })}
              variation="tertiary"
              collapseLeft
              disabled={!quantityAvailable}
            >
              <FormattedMessage id="store/return-app.return-order-list.table-header.select-order" />
            </Button>
          </div>
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

  const handlePaginationClick = async (operation: Operation) => {
    if (currentPage === 1 && operation === 'previous') {
      return
    }

    const newPage = operation === 'next' ? currentPage + 1 : currentPage - 1

    setFetchMoreState('LOADING')
    await handlePagination(newPage, 'next')
    setFetchMoreState('IDLE')
  }

  return (
    <>
      <div className="t-body lh-copy c-muted-1 mb3 ml3 w-two-thirds-ns w-100">
        <FormattedMessage id="store/return-app.request-return.page.header.subtitle" />
      </div>
      <Table
        fullWidth
        emptyStateLabel={
          <FormattedMessage id="store/return-app.return-order-list.table-empty-state-label.no-orders-available" />
        }
        schema={tableSchema}
        items={orders.list}
        loading={fetchMoreState === 'LOADING'}
        pagination={{
          onNextClick: () => handlePaginationClick('next'),
          onPrevClick: () => handlePaginationClick('previous'),
          currentItemFrom: perPage * currentPage - perPage + 1,
          currentItemTo:
            perPage * currentPage > totalItems
              ? totalItems
              : perPage * currentPage,
          textOf: (
            <FormattedMessage id="store/return-app.return-order-list.table-pagination.text-of" />
          ),
          totalItems,
        }}
      />
    </>
  )
}

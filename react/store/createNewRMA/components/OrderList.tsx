import React, { useEffect, useState } from 'react'
import { Link } from 'vtex.render-runtime'
import type { OrdersToReturnList } from 'vtex.return-app'
import { FormattedMessage, FormattedDate } from 'react-intl'
import { Table, Button } from 'vtex.styleguide'

interface Props {
  orders: OrdersToReturnList
  handlePagination: (page: number) => void
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

export const OrderList = ({ orders, handlePagination }: Props) => {
  const [fetchedOrders, setFetchedOrders] = useState<OrdersToReturnList[]>([])
  const { paging } = orders
  const perPage = paging?.perPage ?? 0
  const currentPage = paging?.currentPage ?? 1
  const totalItems = paging?.total ?? 0

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log({ currentPage })
    const alreadyFetched = fetchedOrders.length
      ? fetchedOrders.every((order) => {
          // eslint-disable-next-line no-console
          console.log(order)

          return order.paging?.currentPage === currentPage
        })
      : false

    // eslint-disable-next-line no-console
    console.log(alreadyFetched)
    if (!alreadyFetched) {
      setFetchedOrders((prevOrders) => [...prevOrders, orders])
    }
  }, [orders, fetchedOrders, currentPage])

  const handleNextClick = () => {
    const newPage = currentPage + 1

    // eslint-disable-next-line no-console
    console.log({ fetchedOrders })

    handlePagination(newPage)
  }

  const handlePrevClick = () => {
    if (currentPage === 1) return
    const newPage = currentPage - 1

    // eslint-disable-next-line no-console
    console.log({ fetchedOrders })
    handlePagination(newPage)
  }

  return (
    <>
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
          textOf: 'of',
          totalItems,
        }}
      />
      <Link to="#/my-returns/add/1234">Add</Link>
    </>
  )
}

import React from 'react'
import { Link } from 'vtex.render-runtime'
import type { OrdersToReturnList } from 'vtex.return-app'
import { FormattedMessage, FormattedDate } from 'react-intl'
import { Table } from 'vtex.styleguide'

function availableProductsToReturn({
  invoicedItems,
  // processedItems,
  excludedItems,
}) {
  if (excludedItems.length === invoicedItems.length) return 'Not active'

  const processedItems = [
    { itemIndex: 0, quantity: 3 },
    { itemIndex: 1, quantity: 1 },
    { itemIndex: 2, quantity: 1 },
    { itemIndex: 2, quantity: 1 },
    { itemIndex: 2, quantity: 1 },
  ]

  const unavailableItems = {}

  excludedItems.forEach((item) => {
    unavailableItems[item.itemIndex] = Infinity
  })

  processedItems.forEach(({ itemIndex, quantity }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!unavailableItems.hasOwnProperty(itemIndex)) {
      unavailableItems[itemIndex] = quantity
    } else if (
      // eslint-disable-next-line no-prototype-builtins
      unavailableItems.hasOwnProperty(itemIndex) &&
      unavailableItems[itemIndex] !== Infinity
    ) {
      unavailableItems[itemIndex] =
        quantity + Number(unavailableItems[itemIndex])
    }
  })

  const isActive = invoicedItems.some(({ quantity }, index) => {
    // eslint-disable-next-line no-prototype-builtins
    if (unavailableItems.hasOwnProperty(index)) {
      return quantity > unavailableItems[Number(index)]
    }

    return true
  })

  return isActive ? 'Active' : 'Not active'
}

interface Props {
  orders: OrdersToReturnList
  handlePagination: (page: number, operation: string) => void
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
        const message = availableProductsToReturn(rowData)

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
  const { paging } = orders
  const currentPage = paging?.currentPage ?? 1
  const perPage = paging?.perPage ?? 0
  const totalItems = paging?.total ?? 0

  const handleNextClick = () => {
    const newPage = currentPage + 1

    handlePagination(newPage, '+')
  }

  const handlePrevClick = () => {
    if (currentPage === 1) return
    const newPage = currentPage - 1

    handlePagination(newPage, '-')
  }

  return (
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
  )
}

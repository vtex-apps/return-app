import React, { useCallback, useEffect, useState } from 'react'
import type {
  Maybe,
  OrdersToReturnList,
  OrderToReturnSummary,
  QueryOrdersAvailableToReturnArgs,
} from 'vtex.return-app'
import { FormattedMessage, FormattedDate } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime/'
import { Table, Button } from 'vtex.styleguide'
import type { ApolloQueryResult } from 'apollo-client'

import { createItemsSummary } from '../../utils/createItemsSummary'
import MobileList from '../../../common/components/returnList/MobileList'

type Operation = 'next' | 'previous'
interface Props {
  orders: OrdersToReturnList
  handlePagination: (page: number, operation: Operation) => Promise<void>
  mobileList: Array<Maybe<OrderToReturnSummary>>
  refetch: (
    variables?: QueryOrdersAvailableToReturnArgs | undefined
  ) => Promise<
    ApolloQueryResult<{ ordersAvailableToReturn: OrdersToReturnList }>
  >
}

interface RowData {
  rowData: OrderToReturnSummary
}

type OrderListTableSchemaProps = {
  navigate: (to: { to: string }) => void
  isSmallScreen: boolean
}
const OrderListTableSchema = ({
  navigate,
  isSmallScreen,
}: OrderListTableSchemaProps) => {
  const properties = {
    orderId: {
      title: (
        <FormattedMessage id="store/return-app.return-order-list.table-header.order-id" />
      ),
      minWidth: 150,
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
      minWidth: 120,
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
      cellRenderer: function SelectOrderButton({ rowData }: RowData) {
        const { quantityAvailable } = createItemsSummary(rowData)

        return (
          <div>
            <Button
              {...(!quantityAvailable
                ? null
                : {
                    onClick: () =>
                      navigate({
                        to: `#/my-returns/add/${rowData.orderId}`,
                      }),
                  })}
              variation="tertiary"
              collapseLeft
              disabled={!quantityAvailable}
            >
              <FormattedMessage id="store/return-app.return-order-list.table-header.select-order" />
            </Button>
          </div>
        )
      },
      minWidth: 150,
    },
  }

  const mobileOrder = {
    orderId: null,
    selectOrder: null,
  }

  return {
    properties: isSmallScreen
      ? Object.assign(mobileOrder, properties)
      : properties,
  }
}

export const OrderList = ({
  orders,
  handlePagination,
  mobileList,
  refetch,
}: Props) => {
  const {
    navigate,
    hints: { phone, mobile },
  } = useRuntime()

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

    const newPage =
      operation === 'next' ? Number(currentPage) + 1 : Number(currentPage) - 1

    setFetchMoreState('LOADING')
    await handlePagination(newPage, 'next')
    setFetchMoreState('IDLE')
  }

  const handleFetchMoreProducts = useCallback(async () => {
    const maxPages = paging?.pages ?? 1

    const { scrollHeight } = document.documentElement
    const { scrollTop } = document.documentElement
    const { clientHeight } = document.documentElement

    const userReachedEndOfPage = scrollTop + clientHeight === scrollHeight

    if (!userReachedEndOfPage) return

    if (currentPage < maxPages) {
      try {
        await refetch({ page: currentPage + 1 })
      } catch (err) {
        console.error('Error while fetching more items', err)
      }
    }
  }, [currentPage, paging?.pages, refetch])

  useEffect(() => {
    if (!phone) return

    if (window) {
      window.addEventListener('scroll', handleFetchMoreProducts)
    }

    return () => {
      if (window) {
        window.removeEventListener('scroll', handleFetchMoreProducts)
      }
    }
  }, [phone, handleFetchMoreProducts])

  return (
    <>
      <div className="flex items-center t-body lh-copy mb3 ml3 w-two-thirds-ns w-100 blue">
        <FormattedMessage id="store/return-app.request-return.page.header.subtitle" />
      </div>

      {mobile ? (
        <MobileList cardTypeByPage="request-return" items={mobileList ?? []} />
      ) : (
        <Table
          fullWidth
          emptyStateLabel={
            <FormattedMessage id="store/return-app.return-order-list.table-empty-state-label.no-orders-available" />
          }
          schema={OrderListTableSchema({
            navigate,
            isSmallScreen: phone,
          })}
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
      )}
    </>
  )
}

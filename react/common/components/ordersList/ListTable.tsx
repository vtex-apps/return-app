import React, { useState } from 'react'
import type { OrdersToReturnList, OrderToReturnSummary } from '../../../../typings/OrderToReturn'
import { FormattedMessage, FormattedDate } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { Table, Button } from 'vtex.styleguide'

import { createItemsSummary } from '../../../store/utils/createItemsSummary'
import OrdersTableFilter from './ListTableFilter'

const CSS_HANDLES = ['listTableContainer'] as const

type Operation = 'next' | 'previous'
interface Props {
  orders: OrdersToReturnList
  handlePagination: (page: number, operation: Operation) => Promise<void>
  refetch: (variables?: any) => Promise<any>
  isLoading: boolean
}

interface RowData {
  rowData: OrderToReturnSummary
}

type OrderListTableSchemaProps = {
  navigate: (to: { to: string }) => void
  isSmallScreen: boolean
}
const OrderlListTableSchema = ({
  navigate,
  isSmallScreen,
}: OrderListTableSchemaProps) => {
  const properties = {
    orderId: {
      title: (
        <FormattedMessage id="return-app.return-order-list.table-header.order-id" />
      ),
      minWidth: 150,
    },
    sellerName: {
      title: (
        <FormattedMessage id="return-app.return-order-list.table-header.seller-name" />
      ),
      minWidth: 150,
    },
    creationDate: {
      title: (
        <FormattedMessage id="return-app.return-order-list.table-header.creation-date" />
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
        <FormattedMessage id="return-app.return-order-list.table-header.items-to-return" />
      ),
      cellRenderer: function availableProducts({ rowData }: RowData) {
        const { quantityAvailable, quantity } = createItemsSummary(rowData)

        return <p>{`${quantityAvailable} / ${quantity}`}</p>
      },
    },
    selectOrder: {
      title: (
        <FormattedMessage id="return-app.return-order-list.table-header.select-order" />
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
                        to: `/admin/app/returns/orders/add/${rowData.orderId}`,
                      }),
                  })}
              variation="tertiary"
              collapseLeft
              disabled={!quantityAvailable}
            >
              <FormattedMessage id="return-app.return-order-list.table-header.select-order" />
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
  refetch,
  isLoading,
}: Props) => {
  const {
    navigate,
    route: { domain },
    hints: { phone, mobile },
  } = useRuntime()

  const handles = useCssHandles(CSS_HANDLES)

  const isAdmin = domain === 'admin'

  const [fetchMoreState, setFetchMoreState] = useState<'IDLE' | 'LOADING'>(
    'IDLE'
  )

  const { paging } = orders || {}
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

  return (
    <div className={handles.listTableContainer}>
      {mobile && !isAdmin ? null : (
        <OrdersTableFilter
          refetch={refetch}
          loading={isLoading}
          isDisabled={!orders?.list?.length}
        />
      )}
      <Table
        fullWidth
        emptyStateLabel={
          <FormattedMessage id="return-app.return-order-list.table-empty-state-label.no-orders-available" />
        }
        schema={OrderlListTableSchema({
          navigate,
          isSmallScreen: phone,
        })}
        items={orders?.list}
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
            <FormattedMessage id="return-app.return-order-list.table-pagination.text-of" />
          ),
          totalItems,
        }}
      />
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { ContentWrapper, BaseLoading } from 'vtex.my-account-commons'
import { FormattedMessage } from 'react-intl'

import type {
  OrdersToReturnList,
  QueryOrdersAvailableToReturnArgs,
} from '../../../typings/OrderToReturn'
import ORDERS_AVAILABLE_TO_RETURN from './graphql/getOrdersAvailableToReturn.gql'
import { OrderList } from './components/OrderList'
import { OrderListStructureLoader } from './components/loaders/OrderListStructureLoader'

const headerConfig = {
  namespace: 'vtex-account__return-order-list',
  title: <FormattedMessage id="store/return-app.request-return.page.header" />,
  titleId: 'store/return-app.request-return.page.header"',
  backButton: {
    titleId: 'store/return-app.link',
    path: '/my-returns',
  },
}

export const OrderListContainer = () => {
  const [ordersToReturn, setOrdersToReturn] = useState<OrdersToReturnList[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)

  const { data, loading, error, fetchMore, refetch } = useQuery<
    { ordersAvailableToReturn: OrdersToReturnList },
    QueryOrdersAvailableToReturnArgs
  >(ORDERS_AVAILABLE_TO_RETURN, {
    variables: {
      page: 1,
    },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    if (data) {
      setOrdersToReturn([data.ordersAvailableToReturn])
    }
  }, [data])

  const handlePagination = async (
    page: number,
    operation: 'next' | 'previous'
  ): Promise<void> => {
    const alreadyFetched = ordersToReturn.find((ordersItem) => {
      return ordersItem.paging?.currentPage === page
    })

    if (!alreadyFetched) {
      await fetchMore({
        variables: {
          page,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult

          setOrdersToReturn((prevState) => [
            ...prevState,
            fetchMoreResult.ordersAvailableToReturn,
          ])

          setCurrentPage(
            Number(fetchMoreResult.ordersAvailableToReturn.paging?.currentPage)
          )

          return prevResult
        },
      })

      return
    }

    operation === 'next' && setCurrentPage(page)
    operation === 'previous' && setCurrentPage(page)
  }

  return (
    <>
      {loading || error || !ordersToReturn.length ? (
        <BaseLoading
          queryData={{ loading, error, refetch }}
          headerConfig={headerConfig}
        >
          <OrderListStructureLoader />
        </BaseLoading>
      ) : (
        <ContentWrapper {...headerConfig}>
          {() => (
            <OrderList
              orders={ordersToReturn[currentPage - 1]}
              handlePagination={handlePagination}
            />
          )}
        </ContentWrapper>
      )}
    </>
  )
}

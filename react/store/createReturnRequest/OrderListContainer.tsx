import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import type {
  Maybe,
  OrdersToReturnList,
  OrderToReturnSummary,
  QueryOrdersAvailableToReturnArgs,
} from 'vtex.return-app'
import { ContentWrapper, BaseLoading } from 'vtex.my-account-commons'
import { FormattedMessage } from 'react-intl'

import ORDERS_AVAILABLE_TO_RETURN from './graphql/getOrdersAvailableToReturn.gql'
import { OrderList } from './components/OrderList'
import { OrderListStructureLoader } from './components/loaders/OrderListStructureLoader'

const headerConfig = {
  namespace: 'vtex-account__return-order-list',
  title: <FormattedMessage id="store/return-app.request-return.page.header" />,
  titleId: 'store/return-app.request-return.page.header',
  backButton: {
    titleId: 'store/return-app.link',
    path: '/my-returns',
  },
}

export const OrderListContainer = () => {
  const [ordersToReturn, setOrdersToReturn] = useState<OrdersToReturnList[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [mobileOrdersToReturnList, setMobileOrdersToReturnList] = useState<
    Array<Maybe<OrderToReturnSummary>>
  >([])

  const { data, loading, error, fetchMore, refetch } = useQuery<
    { ordersAvailableToReturn: OrdersToReturnList },
    QueryOrdersAvailableToReturnArgs
  >(ORDERS_AVAILABLE_TO_RETURN, {
    variables: {
      page: 1,
    },
    fetchPolicy: 'no-cache',
  })

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

  const verifyIfItemAlreadyExists = (
    array: Array<Maybe<OrderToReturnSummary>>,
    item: OrderToReturnSummary | null | undefined
  ) => {
    if (!item) return false

    return (
      array.findIndex((arrayItem) => arrayItem?.orderId === item?.orderId) !==
      -1
    )
  }

  useEffect(() => {
    if (data) {
      setOrdersToReturn([data.ordersAvailableToReturn])
      setMobileOrdersToReturnList((current) => {
        const newList = data?.ordersAvailableToReturn?.list ?? []
        const alreadyExist = verifyIfItemAlreadyExists(current, newList?.[0])

        if (alreadyExist) return [...current]

        return [...current, ...(data?.ordersAvailableToReturn?.list ?? [])]
      })
    }
  }, [data])

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
              mobileList={mobileOrdersToReturnList}
              handlePagination={handlePagination}
              refetch={refetch}
            />
          )}
        </ContentWrapper>
      )}
    </>
  )
}

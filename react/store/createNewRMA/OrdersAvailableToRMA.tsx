import React from 'react'
import { useQuery } from 'react-apollo'
import type { OrdersToReturnList } from 'vtex.return-app'
import {
  ContentWrapper,
  BaseLoading,
  SkeletonPiece,
  SkeletonBox,
} from 'vtex.my-account-commons'
import { FormattedMessage } from 'react-intl'

import ORDERS_AVAILABLE_TO_RETURN from './graphql/getOrdersAvailableToReturn.gql'
import { OrderList } from './components/OrderList'

const headerConfig = {
  namespace: 'vtex-account__return-order-list',
  title: <FormattedMessage id="store/return-app.request-return.page.header" />,
  titleId: 'store/return-app.request-return.page.header"',
  backButton: {
    titleId: 'store/return-app.link',
    path: '/my-returns',
  },
}

export const OrdersAvailableToRMA = () => {
  const { data, loading, error, refetch } = useQuery<
    { ordersAvailableToReturn: OrdersToReturnList },
    { page: number }
  >(ORDERS_AVAILABLE_TO_RETURN, {
    variables: {
      page: 1,
    },
  })

  return (
    <>
      {loading || error ? (
        <BaseLoading
          queryData={{ loading, error, refetch }}
          headerConfig={headerConfig}
        >
          <SkeletonBox shouldAllowGrowing shouldShowLowerButton>
            <SkeletonPiece height={40} />
          </SkeletonBox>
        </BaseLoading>
      ) : !data ? null : (
        <ContentWrapper {...headerConfig}>
          {() => <OrderList orders={data.ordersAvailableToReturn} />}
        </ContentWrapper>
      )}
    </>
  )
}

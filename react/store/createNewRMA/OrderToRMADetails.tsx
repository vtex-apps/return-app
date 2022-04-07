import React from 'react'
import { useQuery } from 'react-apollo'
import type { RouteComponentProps } from 'react-router'
import type {
  OrderToReturnSummary,
  QueryOrderToReturnSummaryArgs,
} from 'vtex.return-app'

import ORDER_TO_RETURN_SUMMARY from './graphql/getOrderToReturnSummary.gql'

export const OrderToRMADetails = (
  props: RouteComponentProps<{ orderId: string }>
) => {
  const {
    match: {
      params: { orderId },
    },
  } = props

  const { data, loading, error } = useQuery<
    { orderToReturnSummary: OrderToReturnSummary },
    QueryOrderToReturnSummaryArgs
  >(ORDER_TO_RETURN_SUMMARY, {
    variables: { orderId },
    skip: !orderId,
  })

  // eslint-disable-next-line no-console
  console.log({ data, loading, error })

  return <div>Create RMA</div>
}

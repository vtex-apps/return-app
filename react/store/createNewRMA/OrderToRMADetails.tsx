import type { ApolloError } from 'apollo-client'
import React from 'react'
import { useQuery } from 'react-apollo'
import type { RouteComponentProps } from 'react-router'
import type {
  OrderToReturnSummary,
  QueryOrderToReturnSummaryArgs,
  OrderToReturnValidation,
} from 'vtex.return-app'

import ORDER_TO_RETURN_SUMMARY from './graphql/getOrderToReturnSummary.gql'
import { ORDER_TO_RETURN_VALIDATON } from '../utils/constants'

const { ORDER_NOT_INVOICED, OUT_OF_MAX_DAYS } = ORDER_TO_RETURN_VALIDATON

type CodeError =
  | 'UNKNOWN_ERROR'
  | 'E_HTTP_404'
  | 'FORBIDDEN'
  | OrderToReturnValidation

const getErrorCode = (error: ApolloError): CodeError => {
  const { graphQLErrors } = error

  if (!graphQLErrors.length) {
    return 'UNKNOWN_ERROR'
  }

  const [{ extensions }] = graphQLErrors

  const { code } = extensions?.exception ?? {}

  const knownErrors = [
    ORDER_NOT_INVOICED,
    OUT_OF_MAX_DAYS,
    // order not found
    'E_HTTP_404',
    // userId on session doesn't match with userId on order profile
    'FORBIDDEN',
  ] as const

  const knownError = knownErrors.find((errorCode) => errorCode === code)

  return knownError ?? 'UNKNOWN_ERROR'
}

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

  if (error) {
    const errorCode = getErrorCode(error)

    // eslint-disable-next-line no-console
    console.log({ errorCode })
  }

  // eslint-disable-next-line no-console
  console.log({ data, loading, error })

  return <div>Create RMA</div>
}

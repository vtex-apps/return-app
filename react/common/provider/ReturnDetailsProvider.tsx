import type { FC } from 'react'
import React, { createContext } from 'react'
import type { ApolloError } from 'apollo-client'
import { useQuery } from 'react-apollo'

import type {
  ReturnRequestResponse,
  QueryReturnRequestArgs,
} from '../../../typings/ReturnRequest'
import GET_REQUEST_DETAILS from '../graphql/getRequestDetails.gql'

interface ReturnDetailsSetupInterface {
  data?: { returnRequestDetails: ReturnRequestResponse }
  loading: boolean
  error?: ApolloError
  _handleUpdateQuery: (returnRequestDetails: ReturnRequestResponse) => void
}

export interface CustomRouteProps {
  requestId: string
}

export const ReturnDetailsContext = createContext<ReturnDetailsSetupInterface>(
  {} as ReturnDetailsSetupInterface
)

export const ReturnDetailsProvider: FC<CustomRouteProps> = ({
  requestId,
  children,
}) => {
  const { data, loading, error, updateQuery } = useQuery<
    { returnRequestDetails: ReturnRequestResponse },
    QueryReturnRequestArgs
  >(GET_REQUEST_DETAILS, {
    variables: {
      requestId,
    },
    skip: !requestId,
  })

  const _handleUpdateQuery = (returnRequestDetails: ReturnRequestResponse) => {
    updateQuery(() => ({
      returnRequestDetails,
    }))
  }

  return (
    <ReturnDetailsContext.Provider
      value={{
        data,
        loading,
        error,
        _handleUpdateQuery,
      }}
    >
      {children}
    </ReturnDetailsContext.Provider>
  )
}

import type { FC } from 'react'
import React, { createContext } from 'react'
import type { ApolloError } from 'apollo-client'
import { useQuery } from 'react-apollo'
import type {
  ReturnRequestResponse,
  QueryReturnRequestArgs,
} from 'vtex.return-app'

import GET_REQUEST_DETAILS_ADMIN from '../graphql/getRequestDetailsAdmin.gql'

interface ReturnDetailsSetupInterface {
  data?: { returnRequestDetails: ReturnRequestResponse }
  loading: boolean
  error?: ApolloError
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
  const { data, loading, error } = useQuery<
    { returnRequestDetails: ReturnRequestResponse },
    QueryReturnRequestArgs
  >(GET_REQUEST_DETAILS_ADMIN, {
    variables: {
      requestId,
    },
    skip: !requestId,
  })

  return (
    <ReturnDetailsContext.Provider value={{ data, loading, error }}>
      {children}
    </ReturnDetailsContext.Provider>
  )
}

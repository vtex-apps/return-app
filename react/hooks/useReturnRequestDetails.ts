import { useQuery } from 'react-apollo'
import type {
  QueryReturnRequestArgs,
  ReturnRequestResponse,
} from 'vtex.return-app'

import RETURN_REQUEST_DETAILS from '../graphql/getReturnRequestDetails.gql'

export const useReturnRequestDetails = (requestId: string) => {
  const { data, loading, error } = useQuery<
    { returnRequestDetails: ReturnRequestResponse },
    QueryReturnRequestArgs
  >(RETURN_REQUEST_DETAILS, {
    variables: {
      requestId,
    },
  })

  return { returnDetailsData: { data, loading, error } }
}

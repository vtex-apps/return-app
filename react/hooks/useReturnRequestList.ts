import { useQuery } from 'react-apollo'
import type {
  ReturnRequestList as ReturnRequestListResponse,
  QueryReturnRequestListArgs,
} from 'vtex.return-app'

import RETURN_REQUEST_LIST from '../graphql/getReturnRequestList.gql'

export const useReturnRequestList = () => {
  const { data, loading, error } = useQuery<
    {
      returnRequestList: ReturnRequestListResponse
    },
    QueryReturnRequestListArgs
  >(RETURN_REQUEST_LIST, {
    variables: {
      page: 1,
    },
  })

  return { returnRequestData: { data, loading, error } }
}

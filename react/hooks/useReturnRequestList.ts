import { useQuery } from 'react-apollo'

import type {
  ReturnRequestList as ReturnRequestListResponse,
  QueryReturnRequestListArgs,
} from '../../typings/ReturnRequest'
import RETURN_REQUEST_LIST from '../graphql/getReturnRequestList.gql'

export const useReturnRequestList = () => {
  const { data, loading, error, refetch } = useQuery<
    {
      returnRequestList: ReturnRequestListResponse
    },
    QueryReturnRequestListArgs
  >(RETURN_REQUEST_LIST, {
    variables: {
      page: 1,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
  })

  return { returnRequestData: { data, loading, error, refetch } }
}

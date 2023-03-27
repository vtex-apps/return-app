import { useQuery } from 'react-apollo'
import type {
  ReturnSettingsList as ReturnSettingsListResponse,
  QueryReturnRequestListArgs,
} from 'vtex.return-app'

import SETTINGS_REQUEST_LIST from '../graphql/getSettingsRequestList.gql'

export const useSettingsRequestList = () => {
  const { data, loading, error, refetch } = useQuery<
    {
      returnSettingsList: ReturnSettingsListResponse
    },
    QueryReturnRequestListArgs
  >(SETTINGS_REQUEST_LIST, {
    variables: {
      page: 1,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
  })

  return { returnRequestData: { data, loading, error, refetch } }
}

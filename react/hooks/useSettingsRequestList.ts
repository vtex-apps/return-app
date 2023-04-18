import { useQuery } from 'react-apollo'
import type {
  QueryReturnRequestListArgs,
} from '../../typings/ReturnRequest'
import type { ReturnSettingsList as ReturnSettingsListResponse } from '../../typings/ReturnAppSettings'

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

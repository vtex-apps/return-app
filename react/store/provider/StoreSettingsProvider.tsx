import type { FC } from 'react'
import React, { createContext, useState } from 'react'
import { useQuery } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import type { ReturnAppSettings } from '../../../typings/ReturnAppSettings'
import { Alert } from 'vtex.styleguide'

import STORE_SETTING from '../graphql/getStoreSettings.gql'

interface SettingsContextInterface {
  data?: ReturnAppSettings
  loading: boolean
}

export const StoreSettingsContext = createContext<SettingsContextInterface>(
  {} as SettingsContextInterface
)

export const StoreSettingsPovider: FC = ({ children }) => {
  const { data, loading, error, refetch } =
    useQuery<{ returnAppSettings: ReturnAppSettings }>(STORE_SETTING)

  const [refetching, setRefetching] = useState(false)

  const handleRefetching = async () => {
    setRefetching(true)

    try {
      await refetch()
    } catch (e) {
      console.error(e)
    } finally {
      setRefetching(false)
    }
  }

  return (
    <StoreSettingsContext.Provider
      value={{ data: data?.returnAppSettings, loading }}
    >
      {error && !refetching ? (
        <Alert
          type="error"
          action={{
            label: (
              <FormattedMessage id="store/return-app.return-order-details.setting-provider.error.retry-action" />
            ),
            onClick: () => handleRefetching(),
          }}
        >
          <FormattedMessage id="store/return-app.return-order-details.setting-provider.error" />
        </Alert>
      ) : (
        children
      )}
    </StoreSettingsContext.Provider>
  )
}

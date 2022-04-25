import type { FC } from 'react'
import React, { createContext, useState } from 'react'
import { useQuery } from 'react-apollo'
import type { ReturnAppSettings } from 'vtex.return-app'
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
            label: 'Recarregar',
            onClick: () => handleRefetching(),
          }}
        >
          There was an error loading app settings. Please refresh the page
        </Alert>
      ) : (
        children
      )}
    </StoreSettingsContext.Provider>
  )
}

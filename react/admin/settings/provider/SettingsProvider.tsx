import type { ApolloError } from 'apollo-client'
import type { FC, Dispatch } from 'react'
import React, { createContext, useReducer, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import type { ReturnAppSettings } from 'vtex.return-app'

import APP_SETTINGS from '../graphql/getAppSettings.gql'
import type { Actions } from './settingsReducer'
import { settingsReducer, initialSettingsState } from './settingsReducer'

interface SettingsContextInterface {
  appSettings: ReturnAppSettings
  actions: {
    dispatch: Dispatch<Actions>
  }
  loading: boolean
  error?: ApolloError
}

export const SettingsContext = createContext<SettingsContextInterface>(
  {} as SettingsContextInterface
)

export const SettingsProvider: FC = ({ children }) => {
  const [appSettings, dispatch] = useReducer(
    settingsReducer,
    initialSettingsState
  )

  const { data, loading, error } =
    useQuery<{ returnAppSettings: ReturnAppSettings }>(APP_SETTINGS)

  useEffect(() => {
    if (data?.returnAppSettings) {
      dispatch({
        type: 'updateInitialState',
        payload: data.returnAppSettings,
      })
    }
  }, [data])

  return (
    <SettingsContext.Provider
      value={{ appSettings, loading, error, actions: { dispatch } }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

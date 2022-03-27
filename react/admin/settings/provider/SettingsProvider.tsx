import type { ApolloError } from 'apollo-client'
import type { FC, Dispatch } from 'react'
import React, { createContext, useReducer, useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import type { ReturnAppSettings, ReturnAppSettingsInput } from 'vtex.return-app'

import APP_SETTINGS from '../graphql/getAppSettings.gql'
import SAVE_APP_SETTINGS from '../graphql/saveAppSettings.gql'
import type { Actions } from './settingsReducer'
import { settingsReducer, initialSettingsState } from './settingsReducer'

interface SettingsContextInterface {
  appSettings: ReturnAppSettings
  actions: {
    dispatch: Dispatch<Actions>
    handleSaveAppSettings: () => Promise<void>
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

  const [saveAppSettings, { loading: savingAppSettings }] = useMutation<
    { saveReturnAppSettings: boolean },
    { settings: ReturnAppSettingsInput }
  >(SAVE_APP_SETTINGS)

  // eslint-disable-next-line no-console
  console.log({ savingAppSettings })

  useEffect(() => {
    if (data?.returnAppSettings) {
      dispatch({
        type: 'updateInitialState',
        payload: data.returnAppSettings,
      })
    }
  }, [data])

  const handleSaveAppSettings = async () => {
    // validate the form
    try {
      const { data: mutationResult, errors } = await saveAppSettings({
        variables: { settings: appSettings },
      })

      if (errors) {
        throw new Error('Error saving app settings')
      }

      if (mutationResult?.saveReturnAppSettings) {
        // feedback to the user
        // eslint-disable-next-line no-console
        console.log('saved')
      }
    } catch {
      // feedback to the user
      // eslint-disable-next-line no-console
      console.log('error')
    }
    //
  }

  return (
    <SettingsContext.Provider
      value={{
        appSettings,
        loading,
        error,
        actions: { dispatch, handleSaveAppSettings },
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

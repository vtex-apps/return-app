import type { ApolloError } from 'apollo-client'
import type { FC, Dispatch } from 'react'
import React, { createContext, useReducer, useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import type {ReturnAppSettings, ReturnAppSettingsInput } from 'vtex.return-app'

import APP_SETTINGS from '../graphql/getSellerSettings.gql'
import SAVE_APP_SETTINGS from '../graphql/saveAppSettings.gql'
import { useAlert } from '../../hooks/userAlert'
import { Actions, initialSettingsState } from './settingsReducer'
import { settingsReducer } from './settingsReducer'

interface SettingsDetailContextInterface {
  appSettings: ReturnAppSettings
  actions: {
    dispatch: Dispatch<Actions>
    handleSaveAppSettings: () => Promise<void>
  }
  loading: boolean
  error?: ApolloError
  savingAppSettings: boolean
}

export interface CustomRouteProps {
  sellerId: string
}

export const SettingsDetailContext = createContext<SettingsDetailContextInterface>(
  {} as SettingsDetailContextInterface
)

export const SettingsDetailProvider: FC<CustomRouteProps> = ({ 
  sellerId, 
  children }) => {
  
  console.log(sellerId)

  const [appSettings, dispatch] = useReducer(
    settingsReducer,
    initialSettingsState
  )
 
  const { openAlert } = useAlert()

  const { data, loading, error } =
    useQuery<{ returnSellerSettings: ReturnAppSettings }>(APP_SETTINGS , {
      variables: {
        sellerId
      }
    });

  const [saveAppSettings, { loading: savingAppSettings }] = useMutation<
    { saveReturnAppSettings: boolean },
    { settings: ReturnAppSettingsInput }
  >(SAVE_APP_SETTINGS)

  useEffect(() => {
    if (data?.returnSellerSettings) {
      dispatch({
        type: 'updateInitialState',
        payload: data.returnSellerSettings,
      })
    }
  }, [data])


  useEffect(() => {
   console.log(error)
  }, [error])

  const handleSaveAppSettings = async () => {
    try {
      const { paymentOptions } = appSettings

      const { automaticallyRefundPaymentMethod } = paymentOptions

      const adjustedPaymentOptions = paymentOptions.enablePaymentMethodSelection
        ? paymentOptions
        : {
            ...paymentOptions,
            automaticallyRefundPaymentMethod: Boolean(
              automaticallyRefundPaymentMethod
            ),
          }

      const { data: mutationResult, errors } = await saveAppSettings({
        variables: {
          settings: { ...appSettings, paymentOptions: adjustedPaymentOptions },
        },
      })

      if (errors) {
        throw new Error('Error saving app settings')
      }

      if (mutationResult?.saveReturnAppSettings) {
        openAlert(
          'success',
          <FormattedMessage id="admin/return-app.settings.alert.save.success" />
        )
      }
    } catch {
      openAlert(
        'error',
        <FormattedMessage id="admin/return-app.settings.alert.save.error" />
      )
    }
  }

  return (
    <SettingsDetailContext.Provider
      value={{
        appSettings,
        loading,
        error,
        savingAppSettings,
        actions: { dispatch, handleSaveAppSettings },
      }}
    >
      {children}
    </SettingsDetailContext.Provider>
  )
}

import type { ApolloError } from 'apollo-client'
import type { Dispatch, ReactNode } from 'react'
import React, { createContext, useReducer, useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { FormattedMessage } from 'react-intl'

import type { ReturnAppSettingsInput } from '../../../../typings/ReturnAppSettings'
import type {
  SellerSetting,
  SellerSettingInput,
} from '../../../../typings/SellerSetting'
import APP_SETTINGS from '../graphql/getAppSettings.gql'
import APP_SETTINGS_SELLERS from '../graphql/getSellerSettings.gql'
import SAVE_APP_SETTINGS from '../graphql/saveAppSettings.gql'
import UPDATE_APP_SETTINGS_SELLERS from '../graphql/updateSellerSetting.gql'
import { useAlert } from '../../hooks/userAlert'
import type { Actions } from './settingsReducer'
import { settingsReducer, initialSettingsState } from './settingsReducer'

interface ISettingsProvider {
  children: ReactNode
  sellerId?: string
}
interface SettingsContextInterface {
  appSettings: SellerSetting
  actions: {
    dispatch: Dispatch<Actions>
    handleSaveAppSettings: () => Promise<void>
  }
  loading: boolean
  error?: ApolloError
  savingAppSettings: boolean
  updatingAppSettings: boolean
}

export const SettingsContext = createContext<SettingsContextInterface>(
  {} as SettingsContextInterface
)

export const SettingsProvider = ({ children, sellerId }: ISettingsProvider) => {
  const [appSettings, dispatch] = useReducer(
    settingsReducer,
    initialSettingsState
  )

  const { openAlert } = useAlert()

  const QUERY = sellerId ? APP_SETTINGS_SELLERS : APP_SETTINGS
  const VARIABLES = sellerId ? { variables: { sellerId } } : {}

  const { data, loading, error } = useQuery<{
    returnAppSettings: SellerSetting
    returnSellerSettings: SellerSetting
  }>(QUERY, VARIABLES)

  const [saveAppSettings, { loading: savingAppSettings }] = useMutation<
    { saveReturnAppSettings: boolean; updateSellerSetting: boolean },
    { settings: ReturnAppSettingsInput }
  >(SAVE_APP_SETTINGS)

  const [updateSellerSetting, { loading: updatingAppSettings }] = useMutation<
    { updateSellerSetting: boolean; saveReturnAppSettings: boolean },
    { settings: SellerSettingInput }
  >(UPDATE_APP_SETTINGS_SELLERS)

  useEffect(() => {
    if (data?.returnAppSettings || data?.returnSellerSettings) {
      dispatch({
        type: 'updateInitialState',
        payload: sellerId ? data?.returnSellerSettings : data.returnAppSettings,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

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

      const { id, ...payload } = appSettings
      const MUTATION_VARIABLES = sellerId
        ? {
            id,
            settings: { ...payload, paymentOptions: adjustedPaymentOptions },
          }
        : {
            settings: { ...payload, paymentOptions: adjustedPaymentOptions },
          }

      const { data: mutationResult, errors } = sellerId
        ? await updateSellerSetting({ variables: MUTATION_VARIABLES })
        : await saveAppSettings({ variables: MUTATION_VARIABLES })

      if (errors) {
        throw new Error('Error saving app settings')
      }

      if (
        mutationResult?.saveReturnAppSettings ||
        mutationResult?.updateSellerSetting
      ) {
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
    <SettingsContext.Provider
      value={{
        appSettings,
        loading,
        error,
        savingAppSettings,
        updatingAppSettings,
        actions: { dispatch, handleSaveAppSettings },
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

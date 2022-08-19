import React, { useState, useEffect } from 'react'
import type { FormEvent, ReactElement } from 'react'
import type {
  PaymentOptions as PaymentOptionsInterface,
  PaymentType,
} from 'vtex.return-app'
import { FormattedMessage } from 'react-intl'
import {
  Layout,
  PageHeader,
  PageBlock,
  Divider,
  Button,
  Spinner,
  EmptyState,
} from 'vtex.styleguide'

import { CustomReasons } from './components/CustomReasons'
import { ExcludedCategories } from './components/ExcludedCategories'
import { GeneralOptions } from './components/GeneralOptions'
import { PaymentOptions } from './components/PaymentOptions'
import { RequiredOptions } from './components/RequiredOptions'
import { WarningModal } from './components/WarningModal'
import { useSettings } from './hooks/useSettings'

export interface ModalWarningState {
  openModal: boolean
  customMaxDays: number
  attemptNewSave: boolean
}

export interface CheckboxProps {
  label: ReactElement
  checked: boolean
  name: string
}

const validateOptions = (paymentOptions: PaymentOptionsInterface) => {
  const { enablePaymentMethodSelection, allowedPaymentTypes } = paymentOptions

  // If the user has not enabled the payment method selection, then the allowed payment types can be all unselected.
  if (!enablePaymentMethodSelection) return true

  let result = false

  for (const paymentType of Object.keys(allowedPaymentTypes)) {
    // If we have at least one payment method selected, then the payment options are valid.
    if (allowedPaymentTypes[paymentType]) {
      result = true
      break
    }
  }

  return result
}

export const RMASettings = () => {
  const {
    appSettings,
    loading,
    error,
    savingAppSettings,
    actions: { handleSaveAppSettings, dispatch },
  } = useSettings()

  const [maxDaysWarning, setWarning] = useState<ModalWarningState>({
    openModal: false,
    customMaxDays: 0,
    attemptNewSave: false,
  })

  const [hasPaymentMethodError, setHasPaymentMethodError] = useState(false)

  useEffect(() => {
    if (!maxDaysWarning.attemptNewSave) return

    handleSaveAppSettings()

    setWarning({
      ...maxDaysWarning,
      attemptNewSave: false,
    })
  }, [handleSaveAppSettings, maxDaysWarning])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { customReturnReasons, maxDays, paymentOptions } = appSettings
    const { allowedPaymentTypes, enablePaymentMethodSelection } = paymentOptions

    const maxCustomOptionsDays = customReturnReasons?.reduce(
      (maxDay, option) => (maxDay > option.maxDays ? maxDay : option.maxDays),
      0
    )

    const isAnyPaymentMethod = Object.values(allowedPaymentTypes).some(
      (paymentMethod) => paymentMethod === true
    )

    if (maxCustomOptionsDays && maxCustomOptionsDays < maxDays) {
      setWarning({
        ...maxDaysWarning,
        openModal: true,
        customMaxDays: maxCustomOptionsDays,
      })

      return
    }

    if (!isAnyPaymentMethod && enablePaymentMethodSelection) {
      setHasPaymentMethodError(true)

      return
    }

    setHasPaymentMethodError(false)

    handleSaveAppSettings()
  }

  const handleOptionSelection = (options: { string: CheckboxProps }) => {
    const paymentOptions = Object.keys(options)

    const updatedPaymentOptions = paymentOptions.reduce<PaymentType>(
      (acc, paymentOption) => {
        return {
          ...acc,
          [paymentOption]: options[paymentOption].checked,
        }
      },
      {}
    )

    const paymentOptionsPayload = {
      ...appSettings.paymentOptions,
      allowedPaymentTypes: updatedPaymentOptions,
    }

    dispatch({
      type: 'updatePaymentOptions',
      payload: {
        ...appSettings.paymentOptions,
        allowedPaymentTypes: updatedPaymentOptions,
      },
    })

    if (!validateOptions(paymentOptionsPayload)) {
      setHasPaymentMethodError(true)
      window.scrollTo(0, 20)

      return
    }

    setHasPaymentMethodError(false)
  }

  return (
    <Layout
      pageHeader={
        <PageHeader
          title={
            <FormattedMessage id="admin/return-app.settings.navigation.label" />
          }
        />
      }
    >
      <PageBlock variation="full">
        {error ? (
          <EmptyState
            title={
              <FormattedMessage id="admin/return-app.settings.error.header" />
            }
          >
            <p>
              <FormattedMessage id="admin/return-app.settings.error.description" />
            </p>
          </EmptyState>
        ) : loading ? (
          <Spinner />
        ) : (
          <>
            {maxDaysWarning.openModal && (
              <WarningModal
                setWarning={setWarning}
                customMaxDays={maxDaysWarning.customMaxDays}
              />
            )}
            <form onSubmit={handleSubmit}>
              <RequiredOptions />
              <Divider />
              <ExcludedCategories />
              <Divider />
              <PaymentOptions
                handleOptionSelection={handleOptionSelection}
                hasError={hasPaymentMethodError}
              />
              <Divider />
              <CustomReasons />
              <Divider />
              <GeneralOptions />
              <Divider />
              <div className="flex flex-column mt6">
                <Button
                  disabled={savingAppSettings}
                  variation="primary"
                  type="submit"
                >
                  {savingAppSettings ? (
                    <Spinner size={20} />
                  ) : (
                    <FormattedMessage id="admin/return-app.settings.save.button" />
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </PageBlock>
    </Layout>
  )
}

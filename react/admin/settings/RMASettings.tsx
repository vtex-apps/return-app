import React, { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
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

export const RMASettings = () => {
  const {
    appSettings,
    loading,
    error,
    savingAppSettings,
    actions: { handleSaveAppSettings },
  } = useSettings()

  const [maxDaysWarning, setWarning] = useState<ModalWarningState>({
    openModal: false,
    customMaxDays: 0,
    attemptNewSave: false,
  })

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

    const { customReturnReasons, maxDays } = appSettings

    const maxCustomOptionsDays = customReturnReasons?.reduce(
      (maxDay, option) => (maxDay > option.maxDays ? maxDay : option.maxDays),
      0
    )

    if (maxCustomOptionsDays && maxCustomOptionsDays < maxDays) {
      setWarning({
        ...maxDaysWarning,
        openModal: true,
        customMaxDays: maxCustomOptionsDays,
      })

      return
    }

    handleSaveAppSettings()
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
              <PaymentOptions />
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

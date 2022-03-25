import type { ChangeEvent, FormEvent } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Layout,
  PageHeader,
  PageBlock,
  Input,
  Divider,
  Button,
  Spinner,
  EmptyState,
} from 'vtex.styleguide'

import { CustomReasons } from './components/CustomReasons'
import { ExcludedCategories } from './components/ExcludedCategories'
import { GeneralOptions } from './components/GeneralOptions'
import { PaymenthOptions } from './components/PaymentOptions'
import { useSettings } from './hooks/useSettings'

import './styles.settings.css'

export const RMASettings = () => {
  const {
    appSettings,
    loading,
    error,
    actions: { dispatch },
  } = useSettings()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleMaxDaysInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const maxDays = Number(value)

    if (Number.isNaN(maxDays)) {
      return
    }

    dispatch({ type: 'updateMaxDays', payload: maxDays })
  }

  const handleTermsAndConditionInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    dispatch({ type: 'updateTermsUrl', payload: value })
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
          <form onSubmit={handleSubmit}>
            <div className="flex flex-column">
              <div className="flex flex-row">
                <div className="w-50 ph1">
                  <Input
                    // logic to avoid leading zero to be persistent in the input
                    value={appSettings.maxDays === 0 ? '' : appSettings.maxDays}
                    type="number"
                    size="regular"
                    label={
                      <FormattedMessage id="admin/return-app.settings.max-days.label" />
                    }
                    onChange={handleMaxDaysInput}
                    errorMessage=""
                    required
                  />
                </div>
                <div className="w-50 ph1">
                  <Input
                    value={appSettings.termsUrl}
                    type="url"
                    size="regular"
                    label={
                      <FormattedMessage id="admin/return-app.settings.terms.label" />
                    }
                    onChange={handleTermsAndConditionInput}
                    errorMessage=""
                    required
                  />
                </div>
              </div>
            </div>
            <ExcludedCategories />
            <Divider />
            <PaymenthOptions />
            <Divider />
            <CustomReasons />
            <Divider />
            <GeneralOptions />
            <Divider />
            <div className="flex flex-column mt6">
              <Button variation="primary" type="submit" onClick={() => {}}>
                <FormattedMessage id="admin/return-app.settings.save.button" />
              </Button>
            </div>
          </form>
        )}
      </PageBlock>
    </Layout>
  )
}

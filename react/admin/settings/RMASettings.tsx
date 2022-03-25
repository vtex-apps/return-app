import type { FormEvent } from 'react'
import React from 'react'
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
import { useSettings } from './hooks/useSettings'

import './styles.settings.css'

export const RMASettings = () => {
  const { loading, error } = useSettings()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
            <RequiredOptions />
            <ExcludedCategories />
            <Divider />
            <PaymentOptions />
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

import type { FormEvent } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Layout,
  PageHeader,
  PageBlock,
  Input,
  Divider,
  Button,
} from 'vtex.styleguide'

import { CustomReasons } from './components/CustomReasons'
import { ExcludedCategories } from './components/ExcludedCategories'
import { GeneralOptions } from './components/GeneralOptions'
import { PaymenthOptions } from './components/PaymentOptions'
import { useSettings } from './hooks/useSettings'

import './styles.settings.css'

export const RMASettings = () => {
  const { data, loading, error } = useSettings()

  // eslint-disable-next-line no-console
  console.log({ data, loading, error })

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
        <form onSubmit={handleSubmit}>
          <div className="flex flex-column">
            <div className="flex flex-row">
              <div className="w-50 ph1">
                <Input
                  value={0}
                  size="regular"
                  label={
                    <FormattedMessage id="admin/return-app.settings.max-days.label" />
                  }
                  onChange={() => {}}
                  errorMessage=""
                  required
                />
              </div>
              <div className="w-50 ph1">
                <Input
                  value="/google.com"
                  size="regular"
                  label={
                    <FormattedMessage id="admin/return-app.settings.terms.label" />
                  }
                  onChange={() => {}}
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
      </PageBlock>
    </Layout>
  )
}

import type { ChangeEvent, ReactElement } from 'react'
import React from 'react'
import type { IntlShape } from 'react-intl'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import type { PaymentType } from 'vtex.return-app'
import { Toggle, CheckboxGroup } from 'vtex.styleguide'

import { useSettings } from '../hooks/useSettings'

interface CheckboxProps {
  label: ReactElement
  checked: boolean
  name: string
}

const messages = defineMessages({
  bank: {
    id: 'admin/return-app.settings.section.payment-options.available-payment-methods.bank',
  },
  card: {
    id: 'admin/return-app.settings.section.payment-options.available-payment-methods.card',
  },
  giftCard: {
    id: 'admin/return-app.settings.section.payment-options.available-payment-methods.gift-card',
  },
})

const createOptionsLabel = (
  paymentsTypeOptions: PaymentType,
  intl: IntlShape
) => {
  if (!paymentsTypeOptions) return null

  const paymentTypes = Object.keys(paymentsTypeOptions)
  const createCheckoutOptions = paymentTypes.reduce(
    (checkoutOptions, paymentType) => {
      // This handles the field __typename that comes from the GraphQL query
      if (!messages[paymentType]) return checkoutOptions

      return {
        ...checkoutOptions,
        [paymentType]: {
          label: intl.formatMessage(messages[paymentType]),
          checked: paymentsTypeOptions[paymentType],
          name: paymentType,
        },
      }
    },
    {} as { string: CheckboxProps }
  )

  return createCheckoutOptions
}

export const PaymentOptions = () => {
  const {
    appSettings,
    actions: { dispatch },
  } = useSettings()

  const intl = useIntl()

  const optionsLabel = createOptionsLabel(
    appSettings?.paymentOptions?.allowedPaymentTypes,
    intl
  )

  const handleEnablePaymentMethodSelection = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = e.target

    dispatch({
      type: 'updatePaymentOptions',
      payload: {
        enablePaymentMethodSelection: checked,
        allowedPaymentTypes: appSettings.paymentOptions.allowedPaymentTypes,
      },
    })
  }

  const handleOptionSelection = (options: { string: CheckboxProps }) => {
    const paymentOptions = Object.keys(options)

    const updatedPaymentOptions = paymentOptions.reduce(
      (acc, paymentOption) => {
        return {
          ...acc,
          [paymentOption]: options[paymentOption].checked,
        }
      },
      {}
    )

    dispatch({
      type: 'updatePaymentOptions',
      payload: {
        ...appSettings.paymentOptions,
        allowedPaymentTypes: updatedPaymentOptions,
      },
    })
  }

  const { enablePaymentMethodSelection } = appSettings.paymentOptions ?? {}

  return (
    <section>
      <h3>
        <FormattedMessage id="admin/return-app.settings.section.return-payment-options.header" />
      </h3>
      <div className="mb4 mh4">
        <Toggle
          label={
            enablePaymentMethodSelection ? (
              <FormattedMessage id="admin/return-app.settings.section.payment-options.enable-payment-method-selection.label.check" />
            ) : (
              <FormattedMessage id="admin/return-app.settings.section.payment-options.enable-payment-method-selection.label.uncheck" />
            )
          }
          checked={enablePaymentMethodSelection}
          semantic
          onChange={handleEnablePaymentMethodSelection}
          helpText={
            <FormattedMessage id="admin/return-app.settings.section.payment-options.enable-payment-method-selection.description" />
          }
        />
        {enablePaymentMethodSelection && optionsLabel ? (
          <div>
            <h4>
              <FormattedMessage id="admin/return-app.settings.section.payment-options.available-payment-methods.header" />
            </h4>
            <CheckboxGroup
              name="paymentMethods"
              label={
                <FormattedMessage id="admin/return-app.settings.section.payment-options.available-payment-methods.label" />
              }
              checkedMap={optionsLabel}
              onGroupChange={handleOptionSelection}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}

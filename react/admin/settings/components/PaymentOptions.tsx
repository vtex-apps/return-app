import type { ChangeEvent, ComponentPropsWithoutRef } from 'react'
import React, { forwardRef } from 'react'
import type { IntlShape } from 'react-intl'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import type { PaymentType } from '../../../../typings/ReturnAppSettings'
import { Toggle, CheckboxGroup } from 'vtex.styleguide'

import { useSettings } from '../hooks/useSettings'
import type { CheckboxProps } from '../RMASettings'

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

interface PaymentOptionsProps extends ComponentPropsWithoutRef<'div'> {
  handleOptionSelection: (options: { string: CheckboxProps }) => void
  hasError: boolean
}

export const PaymentOptions = forwardRef<HTMLDivElement, PaymentOptionsProps>(
  ({ handleOptionSelection, hasError }, ref) => {
    const { appSettings, actions } = useSettings()

    const { dispatch } = actions || {}

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
          ...appSettings?.paymentOptions,
          enablePaymentMethodSelection: checked,
          allowedPaymentTypes: appSettings?.paymentOptions?.allowedPaymentTypes,
          // Always return to the default state when use checks / unchecks the checkbox. This way we avaiod a confusing state where buttons is disable but set to on.
          automaticallyRefundPaymentMethod: false,
        },
      })
    }

    const handleAutomaticallyRefundOption = (
      e: ChangeEvent<HTMLInputElement>
    ) => {
      const { checked } = e.target

      dispatch({
        type: 'updatePaymentOptions',
        payload: {
          ...appSettings?.paymentOptions,
          automaticallyRefundPaymentMethod: checked,
        },
      })
    }

    const { enablePaymentMethodSelection, automaticallyRefundPaymentMethod } =
      appSettings?.paymentOptions ?? {}

    return (
      <section>
        <h3>
          <FormattedMessage id="admin/return-app.settings.section.return-payment-options.header" />
        </h3>
        <div className="mb4 mh4">
          <div className="mb4">
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
          </div>
          <div className="mb4">
            <Toggle
              label={
                <FormattedMessage id="admin/return-app.settings.section.payment-options.refund-method-strategy.checkbox.label" />
              }
              checked={automaticallyRefundPaymentMethod}
              semantic
              helpText={
                <FormattedMessage id="admin/return-app.settings.section.payment-options.refund-method-strategy.checkbox.description" />
              }
              onChange={handleAutomaticallyRefundOption}
              disabled={enablePaymentMethodSelection}
            />
          </div>
          {enablePaymentMethodSelection && optionsLabel ? (
            <div ref={ref}>
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
              {!hasError ? null : (
                <p className="c-danger i t-small mt3 lh-title">
                  <FormattedMessage id="admin/return-app.settings.section.payment-options.enable-payment-method-selection.error" />
                </p>
              )}
            </div>
          ) : null}
        </div>
      </section>
    )
  }
)

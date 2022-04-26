import React, { useState, useEffect, useContext } from 'react'
import type { ChangeEvent } from 'react'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import type { RefundPaymentDataInput, PaymentTypeInput } from 'vtex.return-app'
import { Input, RadioGroup } from 'vtex.styleguide'

import { StoreSettingsContext } from '../../provider/StoreSettingsProvider'

type PaymentMethodsOptions = {
  value: string
  label: React.ReactElement
}

const messages = defineMessages({
  formIBAN: { id: 'store/return-app.return-order-details.payment-method.iban' },
  formAccountHolder: {
    id: 'store/return-app.return-order-details.payment-method.account-holder',
  },
})

export const PaymentMethods = () => {
  const { formatMessage } = useIntl()
  const [paymentInputs, setPaymentInputs] = useState<RefundPaymentDataInput>({
    refundPaymentMethod: 'bank',
    iban: '',
    accountHolderName: '',
  })

  const [paymentSettings, setPaymentSettings] = useState<PaymentTypeInput>({})

  const { data } = useContext(StoreSettingsContext)

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(data, 'data from payment')

    if (data) {
      const { bank, card, giftCard } = data?.paymentOptions.allowedPaymentTypes

      setPaymentSettings({
        bank,
        card,
        giftCard,
      })
    }
  }, [data])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setPaymentInputs((prevState) => ({ ...prevState, [name]: value }))
  }

  const paymentMethods = () => {
    const output: PaymentMethodsOptions[] = []

    if (paymentSettings.card) {
      output.push({
        value: 'card',
        label: (
          <FormattedMessage id="store/return-app.return-order-details.payment-options.card" />
        ),
      })
    }

    if (paymentSettings.giftCard) {
      output.push({
        value: 'giftCard',
        label: (
          <FormattedMessage id="store/return-app.return-order-details.payment-options.gift-card" />
        ),
      })
    }

    if (paymentSettings.bank) {
      output.push({
        value: 'bank',
        label: (
          <FormattedMessage id="store/return-app.return-order-details.payment-options.bank" />
        ),
      })
    }

    return output
  }

  const settings = { hidePaymentMethodSelection: false }

  return (
    <div className="flex-ns flex-wrap flex-auto flex-column pa4 mb6">
      <p>
        <FormattedMessage id="store/return-app.return-order-details.payment-method.subtitle" />
      </p>
      {settings.hidePaymentMethodSelection ? (
        <FormattedMessage id="store/return-app.return-order-details.payment-method.default" />
      ) : (
        <RadioGroup
          hideBorder
          name="refundPaymentMethod"
          options={paymentMethods()}
          value={paymentInputs.refundPaymentMethod}
          onChange={handleInputChange}
        />
      )}
      {paymentInputs.refundPaymentMethod === 'bank' ? (
        <div>
          <div className="flex-ns flex-wrap flex-auto flex-column mt6 mw6">
            <Input
              name="accountHolderName"
              placeholder={formatMessage(messages.formAccountHolder)}
              onChange={handleInputChange}
              value={paymentInputs.accountHolderName}
            />
          </div>
          <div className="flex-ns flex-wrap flex-auto flex-column mt4 mw6">
            <Input
              name="iban"
              placeholder={formatMessage(messages.formIBAN)}
              onChange={handleInputChange}
              value={paymentInputs.iban}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

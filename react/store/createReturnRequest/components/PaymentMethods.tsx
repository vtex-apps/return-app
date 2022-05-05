import React, { useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import type {
  RefundPaymentDataInput,
  PaymentType,
  RefundPaymentMethod,
} from 'vtex.return-app'
import { Input, RadioGroup } from 'vtex.styleguide'

import { useStoreSettings } from '../../hooks/useStoreSettings'
import { useReturnRequest } from '../../hooks/useReturnRequest'

interface Props {
  canRefundCard?: boolean
}

type PaymentMethodsOptions = {
  value: keyof PaymentType
  label: React.ReactElement
}

const messages = defineMessages({
  formIBAN: { id: 'store/return-app.return-order-details.payment-method.iban' },
  formAccountHolder: {
    id: 'store/return-app.return-order-details.payment-method.account-holder',
  },
})

export const PaymentMethods = ({ canRefundCard }: Props) => {
  const { formatMessage } = useIntl()

  const { data } = useStoreSettings()
  const { paymentOptions } = data ?? {}
  const { allowedPaymentTypes, enablePaymentMethodSelection } =
    paymentOptions ?? {}

  const {
    returnRequest,
    inputErrors,
    actions: { updateReturnRequest },
  } = useReturnRequest()

  const { refundPaymentData } = returnRequest

  useEffect(() => {
    if (!enablePaymentMethodSelection) {
      updateReturnRequest({
        type: 'updateRefundPaymentData',
        payload: {
          ...refundPaymentData,
          refundPaymentMethod: 'sameAsPurchase',
        },
      })
    }
  }, [enablePaymentMethodSelection, updateReturnRequest, refundPaymentData])

  const handleRefundPaymentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    const refundPaymentPayload = {
      ...refundPaymentData,
      refundPaymentMethod: value as RefundPaymentMethod,
    }

    updateReturnRequest({
      type: 'updateRefundPaymentData',
      payload: refundPaymentPayload,
    })
  }

  const handleBankDetailsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const refundPaymentPayload = {
      ...refundPaymentData,
      refundPaymentMethod: refundPaymentData?.refundPaymentMethod ?? 'bank',
      [name as keyof RefundPaymentDataInput]: value,
    }

    updateReturnRequest({
      type: 'updateRefundPaymentData',
      payload: refundPaymentPayload,
    })
  }

  const paymentMethods = () => {
    if (!allowedPaymentTypes) return []
    const { bank, card, giftCard } = allowedPaymentTypes
    const output: PaymentMethodsOptions[] = []

    if (card && canRefundCard) {
      output.push({
        value: 'card',
        label: (
          <FormattedMessage id="store/return-app.return-order-details.payment-options.card" />
        ),
      })
    }

    if (giftCard) {
      output.push({
        value: 'giftCard',
        label: (
          <FormattedMessage id="store/return-app.return-order-details.payment-options.gift-card" />
        ),
      })
    }

    if (bank) {
      output.push({
        value: 'bank',
        label: (
          <FormattedMessage id="store/return-app.return-order-details.payment-options.bank" />
        ),
      })
    }

    return output
  }

  const paymentMethodError = inputErrors.some(
    (error) => error === 'refund-payment-data'
  )

  const bankDetailsError = inputErrors.some((error) => error === 'bank-details')

  return (
    <div className="flex-ns flex-wrap flex-auto flex-column pa4 mb6">
      <p>
        <FormattedMessage id="store/return-app.return-order-details.payment-method.subtitle" />
      </p>
      {!enablePaymentMethodSelection ? (
        <p className="i-s">
          <FormattedMessage id="store/return-app.return-order-details.payment-method.default" />
        </p>
      ) : (
        <>
          <RadioGroup
            hideBorder
            name="refundPaymentMethod"
            options={paymentMethods()}
            value={refundPaymentData?.refundPaymentMethod ?? ''}
            onChange={handleRefundPaymentChange}
          />
          {paymentMethodError && !refundPaymentData?.refundPaymentMethod ? (
            <div>Required</div>
          ) : null}
        </>
      )}
      {refundPaymentData?.refundPaymentMethod === 'bank' ? (
        <div>
          <div className="flex-ns flex-wrap flex-auto flex-column mt6 mw6">
            <Input
              name="accountHolderName"
              placeholder={formatMessage(messages.formAccountHolder)}
              onChange={handleBankDetailsChange}
              value={refundPaymentData.accountHolderName ?? ''}
            />
            {bankDetailsError && !refundPaymentData.accountHolderName ? (
              <div>Required</div>
            ) : null}
          </div>
          <div className="flex-ns flex-wrap flex-auto flex-column mt4 mw6">
            <Input
              name="iban"
              placeholder={formatMessage(messages.formIBAN)}
              onChange={handleBankDetailsChange}
              value={refundPaymentData.iban ?? ''}
            />
            {bankDetailsError && !refundPaymentData.iban ? (
              <div>Required</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

import React from 'react'
import type { ChangeEvent } from 'react'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import type {
  RefundPaymentDataInput,
  PaymentType,
  RefundPaymentMethod,
} from 'vtex.return-app'
import { Input, RadioGroup } from 'vtex.styleguide'

import { useStoreSettings } from '../../hooks/useStoreSettings'
import { useReturnRequest } from '../../hooks/useReturnRequest'
import { CustomMessage } from './layout/CustomMessage'
import { defaultPaymentMethodsMessages } from '../../utils/defaultPaymentMethodsMessages'
import { isValidIBANNumber } from '../../utils/isValidIBANNumber'

interface Props {
  canRefundCard: boolean
}

type PaymentMethodsOptions = {
  value: keyof PaymentType
  label: string
}

const CSS_HANDLES = ['paymentMethodContainer', 'paymentBankWrapper'] as const

const messages = defineMessages({
  formIBAN: { id: 'return-app.return-order-details.payment-method.iban' },
  formAccountHolder: {
    id: 'return-app.return-order-details.payment-method.account-holder',
  },
})

export const PaymentMethods = ({ canRefundCard }: Props) => {
  const { formatMessage } = useIntl()
  const handles = useCssHandles(CSS_HANDLES)

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
        label: formatMessage(defaultPaymentMethodsMessages.card),
      })
    }

    if (giftCard) {
      output.push({
        value: 'giftCard',
        label: formatMessage(defaultPaymentMethodsMessages.giftCard),
      })
    }

    if (bank) {
      output.push({
        value: 'bank',
        label: formatMessage(defaultPaymentMethodsMessages.bank),
      })
    }

    return output
  }

  const paymentMethodError = inputErrors.some(
    (error) => error === 'refund-payment-data'
  )

  const bankDetailsError = inputErrors.some((error) => error === 'bank-details')

  return (
    <div
      className={`${handles.paymentMethodContainer} flex-ns flex-wrap flex-auto flex-column pa4 mb6`}
    >
      <p>
        <FormattedMessage id="return-app.return-order-details.payment-method.description" />
      </p>
      {!enablePaymentMethodSelection ? (
        <p className="i-s">
          <FormattedMessage id="return-app.return-order-details.payment-method.default" />
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
            <CustomMessage
              status="error"
              message={
                <FormattedMessage id="return-app.return-payment-methods.input-payment-method.error" />
              }
            />
          ) : null}
        </>
      )}
      {refundPaymentData?.refundPaymentMethod === 'bank' ? (
        <div className={`${handles.paymentMethodContainer}`}>
          <div className="flex-ns flex-wrap flex-auto flex-column mt6 mw6">
            <Input
              name="accountHolderName"
              placeholder={formatMessage(messages.formAccountHolder)}
              onChange={handleBankDetailsChange}
              value={refundPaymentData.accountHolderName ?? ''}
            />
            {bankDetailsError && !refundPaymentData.accountHolderName ? (
              <CustomMessage
                status="error"
                message={
                  <FormattedMessage id="return-app.return-payment-methods.input-account-holder.error" />
                }
              />
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
              <CustomMessage
                status="error"
                message={
                  <FormattedMessage id="return-app.return-payment-methods.input-iban.error" />
                }
              />
            ) : null}
            {bankDetailsError &&
            refundPaymentData.iban &&
            !isValidIBANNumber(refundPaymentData.iban) ? (
              <CustomMessage
                status="error"
                message={
                  <FormattedMessage id="return-app.return-payment-methods.input-iban-invalid.error" />
                }
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

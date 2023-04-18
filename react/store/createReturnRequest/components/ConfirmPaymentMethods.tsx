import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import type { RefundPaymentDataInput } from '../../../../typings/ReturnRequest'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

import { defaultPaymentMethodsMessages } from '../../utils/defaultPaymentMethodsMessages'

interface Props {
  refundPaymentData: RefundPaymentDataInput
}

const CSS_HANDLES = [
  'confirmPaymentContainer',
  'confirmPaymentTitle',
  'accountHolderWrapper',
  'ibanWrapper',
  'accountHolderText',
  'confirmPaymentValue',
  'ibanText',
  'refundPaymentText',
] as const

export const ConfirmPaymentMethods = ({ refundPaymentData }: Props) => {
  const { formatMessage } = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const {
    hints: { phone },
  } = useRuntime()

  return (
    <div
      className={`${handles.confirmPaymentContainer} ${
        phone ? 'w-100' : 'w-40'
      }`}
    >
      <h2 className={`${handles.confirmPaymentTitle} mt0 mb6`}>
        <FormattedMessage id="return-app.confirm-and-submit.refund-method.title" />
      </h2>
      {refundPaymentData?.refundPaymentMethod === 'bank' ? (
        <>
          <div className={`${handles.accountHolderWrapper} flex`}>
            <p className={`${handles.accountHolderText} f6 mr2 gray b`}>
              <FormattedMessage id="return-app.confirm-payment-methods.refund-method.p-account-holder-name" />
            </p>
            <p className={`${handles.confirmPaymentValue} f6 gray`}>
              {refundPaymentData.accountHolderName}
            </p>
          </div>
          <div className={`${handles.ibanWrapper} flex`}>
            <p className={`${handles.ibanText} f6 mr2 gray b`}>
              <FormattedMessage id="return-app.confirm-payment-methods.refund-method.p-iban" />
            </p>
            <p className={`${handles.confirmPaymentValue} f6 gray `}>
              {refundPaymentData.iban}
            </p>
          </div>
        </>
      ) : (
        <p className={`${handles.confirmPaymentValue} f6 gray `}>
          {formatMessage(
            defaultPaymentMethodsMessages[refundPaymentData?.refundPaymentMethod]
          )}
        </p>
      )}
    </div>
  )
}

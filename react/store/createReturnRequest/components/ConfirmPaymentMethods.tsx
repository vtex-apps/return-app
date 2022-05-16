import React from 'react'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import type { RefundPaymentDataInput } from 'vtex.return-app'

interface Props {
  refundPaymentData: RefundPaymentDataInput
}

const messages = defineMessages({
  card: {
    id: 'store/return-app.confirm-payment-methods.refund-method.p-card',
  },
  giftCard: {
    id: 'store/return-app.confirm-payment-methods.refund-method.p-gift-card',
  },
  sameAsPurchase: {
    id: 'store/return-app.confirm-payment-methods.refund-method.p-same-as-purchase',
  },
})

export const ConfirmPaymentMethods = ({ refundPaymentData }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <div className="w-40">
      <h2 className="mt0 mb6">
        <FormattedMessage id="store/return-app.confirm-and-submit.refund-method.title" />
      </h2>
      {refundPaymentData?.refundPaymentMethod === 'bank' ? (
        <>
          <div className="flex">
            <p className="f6 mr2 gray b">
              <FormattedMessage id="store/return-app.confirm-payment-methods.refund-method.p-account-holder-name" />
            </p>
            <p className="f6 gray ">{refundPaymentData.accountHolderName}</p>
          </div>
          <div className="flex">
            <p className="f6 mr2 gray b">
              <FormattedMessage id="store/return-app.confirm-payment-methods.refund-method.p-iban" />
            </p>
            <p className="f6 gray ">{refundPaymentData.iban}</p>
          </div>
        </>
      ) : (
        <p className="f6 gray ">
          {formatMessage(messages[refundPaymentData?.refundPaymentMethod])}
        </p>
      )}
    </div>
  )
}

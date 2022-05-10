import React from 'react'
import { FormattedMessage } from 'react-intl'
import type { RefundPaymentDataInput } from 'vtex.return-app'

interface Props {
  refundPaymentData?: RefundPaymentDataInput
}

const ConfirmPaymentMethods = ({ refundPaymentData }: Props) => {
  return (
    <div className="w-40">
      <h2 className="mt0 mb6">
        <FormattedMessage id="store/return-app.confirm-and-submit.refund-method.title" />
      </h2>
      {refundPaymentData?.refundPaymentMethod === 'bank' ? (
        <>
          <p className="f6 gray ">{refundPaymentData.iban}</p>
          <p className="f6 gray ">{refundPaymentData.accountHolderName}</p>
        </>
      ) : (
        <p className="f6 gray ">
          <FormattedMessage
            id={`store/return-app.confirm-payment-methods.refund-method.p-${refundPaymentData?.refundPaymentMethod}`}
          />
        </p>
      )}
    </div>
  )
}

export default ConfirmPaymentMethods

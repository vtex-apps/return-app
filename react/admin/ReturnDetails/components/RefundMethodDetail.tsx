import React from 'react'
import { FormattedMessage } from 'react-intl'
import { FormattedCurrency } from 'vtex.format-currency'
import type { GiftCard, Maybe, RefundPaymentData } from 'vtex.return-app'

import { useReturnDetails } from '../../hooks/useReturnDetails'

const messageId =
  'admin/return-app.return-request-details.payent-method.refund-option'

interface RefundMethodProps {
  refundPaymentData: RefundPaymentData
  giftCard: Maybe<GiftCard> | undefined
  refundValue: Maybe<number> | undefined
}

const RefundPayment = ({
  refundPaymentData,
  giftCard,
  refundValue,
}: RefundMethodProps) => {
  const { refundPaymentMethod, iban, accountHolderName } = refundPaymentData

  if (refundPaymentMethod === 'giftCard') {
    return (
      <div>
        <p>
          <FormattedMessage
            id={`${messageId}.refund-method`}
            values={{
              refundMethod: <FormattedMessage id={`${messageId}.gift-card`} />,
            }}
          />
        </p>
        {giftCard && refundValue ? (
          <>
            <p>
              <FormattedMessage
                id={`${messageId}.gift-card-code`}
                values={{
                  code: giftCard.redemptionCode,
                }}
              />
            </p>

            <p>
              <FormattedMessage
                id={`${messageId}.gift-card-value`}
                values={{
                  value: <FormattedCurrency value={refundValue / 100} />,
                }}
              />
            </p>
          </>
        ) : (
          <></>
        )}
      </div>
    )
  }

  if (refundPaymentMethod === 'bank') {
    return (
      <div>
        <p>
          <FormattedMessage
            id={`${messageId}.refund-method`}
            values={{
              refundMethod: <FormattedMessage id={`${messageId}.bank`} />,
            }}
          />
        </p>
        <p>
          <FormattedMessage
            id={`${messageId}.iban`}
            values={{
              iban,
            }}
          />
        </p>
        <p>
          <FormattedMessage
            id={`${messageId}.account-holder`}
            values={{ accountHolderName }}
          />
        </p>
      </div>
    )
  }

  if (refundPaymentMethod === 'card') {
    return (
      <div>
        <p>
          <FormattedMessage
            id={`${messageId}.refund-method`}
            values={{
              refundMethod: <FormattedMessage id={`${messageId}.card`} />,
            }}
          />
        </p>
      </div>
    )
  }

  if (refundPaymentMethod === 'sameAsPurchase') {
    return (
      <div>
        <p>
          <FormattedMessage
            id={`${messageId}.refund-method`}
            values={{
              refundMethod: (
                <FormattedMessage id={`${messageId}.same-as-purchase`} />
              ),
            }}
          />
        </p>
      </div>
    )
  }

  return null
}

export const RefundMethodDetail = () => {
  const { data } = useReturnDetails()

  if (!data) return null

  const {
    returnRequestDetails: { refundPaymentData, refundData },
  } = data

  if (!refundPaymentData) return null

  return (
    <section>
      <h3>
        <FormattedMessage id="admin/return-app.return-request-details.payent-method.title" />
      </h3>
      <RefundPayment
        refundPaymentData={refundPaymentData}
        giftCard={refundData?.giftCard}
        refundValue={refundData?.invoiceValue}
      />
    </section>
  )
}

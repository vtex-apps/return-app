import React from 'react'
import { FormattedMessage, FormattedNumber, defineMessages } from 'react-intl'
import type { GiftCard, Maybe, RefundPaymentData } from 'odp.return-app'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

import { useReturnDetails } from '../../hooks/useReturnDetails'

const CSS_HANDLES = ['refundMethodDetailContainer'] as const

const messageId =
  'return-app.return-request-details.payent-method.refund-option'

const messages = defineMessages({
  [`${messageId}.refund-method`]: {
    id: `${messageId}.refund-method`,
    defaultMessage: 'Refund Method'
  },
  [`${messageId}.gift-card`]: {
    id: `${messageId}.gift-card`,
    defaultMessage: 'Gift Card'
  },
  [`${messageId}.bank`]: {
    id: `${messageId}.bank`,
    defaultMessage: 'Bank'
  },
  [`${messageId}.card`]: {
    id: `${messageId}.card`,
    defaultMessage: 'Card'
  },
  [`${messageId}.same-as-purchase`]: {
    id: `${messageId}.same-as-purchase`,
    defaultMessage: 'Same as Purchase'
  }
})

interface RefundMethodProps {
  refundPaymentData: RefundPaymentData
  giftCard: Maybe<GiftCard> | undefined
  refundValue: Maybe<number> | undefined
  currency: string
}

const RefundPayment = (props: RefundMethodProps) => {
  const handles = useCssHandles(CSS_HANDLES)
  const {
    route: { domain },
  } = useRuntime()

  const { refundPaymentData, giftCard, refundValue, currency } = props

  const {
    refundPaymentMethod,
    iban,
    accountHolderName,
    automaticallyRefundPaymentMethod,
  } = refundPaymentData

  if (refundPaymentMethod === 'giftCard') {
    return (
      <div className={handles.refundMethodDetailContainer}>
        <p>
          <FormattedMessage
            {...messages[`${messageId}.refund-method`]}
            values={{
              refundMethod: <FormattedMessage {...messages[`${messageId}.gift-card`]} />,
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
                  value: (
                    <FormattedNumber
                      value={refundValue / 100}
                      style="currency"
                      currency={currency}
                    />
                  ),
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
            {...messages[`${messageId}.refund-method`]}
            values={{
              refundMethod: <FormattedMessage {...messages[`${messageId}.bank`]} />,
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
            {...messages[`${messageId}.refund-method`]}
            values={{
              refundMethod: <FormattedMessage {...messages[`${messageId}.card`]} />,
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
            {...messages[`${messageId}.refund-method`]}
            values={{
              refundMethod: (
                <FormattedMessage {...messages[`${messageId}.same-as-purchase`]} />
              ),
            }}
          />
        </p>
        {domain !== 'admin' ? null : (
          <FormattedMessage
            id="return-app.return-request-details.payent-method.refund-option.refund-process"
            values={{ automaticallyRefundPaymentMethod }}
          />
        )}
      </div>
    )
  }

  return null
}

export const RefundMethodDetail = () => {
  const { data } = useReturnDetails()

  if (!data) return null

  const {
    returnRequestDetails: { refundPaymentData, refundData, cultureInfoData },
  } = data

  if (!refundPaymentData) return null

  return (
    <section className="flex-ns flex-wrap flex-auto flex-column pt4 pb4">
      <h3>
        <FormattedMessage id="return-app.return-request-details.payent-method.title" />
      </h3>
      <RefundPayment
        refundPaymentData={refundPaymentData}
        giftCard={refundData?.giftCard}
        refundValue={refundData?.invoiceValue}
        currency={cultureInfoData.currencyCode}
      />
    </section>
  )
}

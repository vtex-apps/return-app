import type { FunctionComponent } from 'react'
import React from 'react'
import { FormattedCurrency } from 'vtex.format-currency'
import { defineMessages, injectIntl } from 'react-intl'

import styles from '../styles.css'

interface Props {
  request: any
  giftCardValue: any
  intl: any
}

const RequestInfo: FunctionComponent<Props> = (props) => {
  const {
    request,
    giftCardValue,
    intl: { formatMessage },
  } = props

  const messages = defineMessages({
    contactDetails: { id: `returns.contactDetails` },
    name: { id: `returns.name` },
    email: { id: `returns.email` },
    phone: { id: `returns.phone` },
    pickupAddress: { id: `returns.pickupAddress` },
    country: { id: `returns.country` },
    locality: { id: `returns.locality` },
    address: { id: `returns.address` },
    formExtraComment: { id: 'returns.formExtraComment' },
    state: { id: `returns.state` },
    zip: { id: `returns.zip` },
    refundPaymentMethod: {
      id: `returns.refundPaymentMethod`,
      paymentMethod: 'bank',
    },
    formAccountHolder: { id: `returns.formAccountHolder` },
    formBankTransferAccount: { id: `returns.formBankTransferAccount` },
    formVoucher: { id: `returns.formVoucher` },
    voucherCode: { id: `returns.voucherCode` },
    voucherCodeNotGenerated: { id: `returns.voucherCodeNotGenerated` },
    voucherValue: { id: `returns.voucherValue` },
  })

  return (
    <div className={`${styles.requestInfoMainContent}`}>
      <div
        className={`flex-ns flex-wrap flex-row ${styles.requestInfoContentRow}`}
      >
        <div
          className={`flex-ns flex-wrap flex-auto flex-column pt4 pb4 ${styles.requestInfoContentColumn} ${styles.requestInfoContentColumnLeft}`}
        >
          <p className={`${styles.requestInfoSectionTitle}`}>
            <strong className={`${styles.requestInfoSectionTitleStrong}`}>
              {formatMessage({ id: messages.contactDetails.id })}
            </strong>
          </p>
          <div className={`mb5 ${styles.requestInfoTextContainer}`}>
            <p
              className={`ma0 t-small c-on-base ${styles.requestInfoTextHolder}`}
            >
              <span className={`${styles.requestInfoTextLabel}`}>
                {formatMessage({ id: messages.name.id })}:
              </span>{' '}
              <span className={`${styles.requestInfoText}`}>
                {request.name}
              </span>
            </p>
          </div>
          <div className={`mb5 ${styles.requestInfoTextContainer}`}>
            <p
              className={`ma0 t-small c-on-base ${styles.requestInfoTextHolder}`}
            >
              <span className={`${styles.requestInfoTextLabel}`}>
                {formatMessage({ id: messages.email.id })}:
              </span>{' '}
              <span className={`${styles.requestInfoText}`}>
                {request.email}
              </span>
            </p>
          </div>
          <div className={`mb5 ${styles.requestInfoTextContainer}`}>
            <p
              className={`ma0 t-small c-on-base ${styles.requestInfoTextHolder}`}
            >
              <span className={`${styles.requestInfoTextLabel}`}>
                {formatMessage({ id: messages.phone.id })}:
              </span>{' '}
              <span className={`${styles.requestInfoText}`}>
                {request.phoneNumber}
              </span>
            </p>
          </div>
        </div>

        <div
          className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.requestInfoContentColumn} ${styles.requestInfoContentColumnRight}`}
        >
          <p className={`${styles.requestInfoSectionTitle}`}>
            <strong className={`${styles.requestInfoSectionTitleStrong}`}>
              {formatMessage({ id: messages.pickupAddress.id })}
            </strong>
          </p>
          <div className={`mb5 ${styles.requestInfoTextContainer}`}>
            <p
              className={`ma0 t-small c-on-base ${styles.requestInfoTextHolder}`}
            >
              <span className={`${styles.requestInfoTextLabel}`}>
                {formatMessage({ id: messages.country.id })}:
              </span>{' '}
              <span className={`${styles.requestInfoText}`}>
                {request.country}
              </span>
            </p>
          </div>
          <div className={`mb5 ${styles.requestInfoTextContainer}`}>
            <p
              className={`ma0 t-small c-on-base ${styles.requestInfoTextHolder}`}
            >
              <span className={`${styles.requestInfoTextLabel}`}>
                {formatMessage({ id: messages.locality.id })}:
              </span>{' '}
              <span className={`${styles.requestInfoText}`}>
                {request.locality}
              </span>
            </p>
          </div>
          <div className={`mb5 ${styles.requestInfoTextContainer}`}>
            <p
              className={`ma0 t-small c-on-base ${styles.requestInfoTextHolder}`}
            >
              <span className={`${styles.requestInfoTextLabel}`}>
                {formatMessage({ id: messages.address.id })}:
              </span>{' '}
              <span className={`${styles.requestInfoText}`}>
                {request.address}
              </span>
            </p>
          </div>
          <div className={`mb5 ${styles.requestInfoTextContainer}`}>
            <p
              className={`ma0 t-small c-on-base ${styles.requestInfoTextHolder}`}
            >
              <span className={`${styles.requestInfoTextLabel}`}>
                {formatMessage({ id: messages.state.id })}:
              </span>{' '}
              <span className={`${styles.requestInfoText}`}>
                {request.state}
              </span>
            </p>
          </div>
          <div className={`mb5 ${styles.requestInfoTextContainer}`}>
            <p
              className={`ma0 t-small c-on-base ${styles.requestInfoTextHolder}`}
            >
              <span className={`${styles.requestInfoTextLabel}`}>
                {formatMessage({ id: messages.zip.id })}:
              </span>{' '}
              <span className={`${styles.requestInfoText}`}>{request.zip}</span>
            </p>
          </div>
        </div>
      </div>
      <p
        className={`${styles.requestInfoSectionTitle} ${styles.requestInfoPaymentTitle}`}
      >
        <strong className={`${styles.requestInfoPaymentTitleStrong}`}>
          {formatMessage({ id: messages.refundPaymentMethod.id })}
        </strong>
      </p>
      {request.paymentMethod === 'bank' ? (
        <div className="flex-ns flex-wrap flex-auto flex-column mt4">
          <p
            className={`ma1 t-small c-on-base ${styles.requestInfoPaymentMethod}`}
          >
            <span className={`${styles.requestInfoPaymentLabel}`}>
              {formatMessage({ id: messages.formAccountHolder.id })}
            </span>
            {': '}
            <span className={`${styles.requestInfoIbanText}`}>
              {request.accountHolder}
            </span>
          </p>
          <p
            className={`ma1 t-small c-on-base ${styles.requestInfoPaymentMethod}`}
          >
            <span className={`${styles.requestInfoPaymentLabel}`}>
              {formatMessage({ id: messages.formBankTransferAccount.id })}
            </span>{' '}
            <span className={`${styles.requestInfoIbanText}`}>
              {request.iban}
            </span>
          </p>
        </div>
      ) : request.paymentMethod === 'giftCard' ? (
        <div>
          <p
            className={`ma1 t-small c-on-base ${styles.requestInfoPaymentMethod}`}
          >
            {formatMessage({ id: messages.formVoucher.id })}
          </p>
          <p
            className={`ma1 t-small c-on-base ${styles.requestInfoGiftCardCode}`}
          >
            <span className={`${styles.requestInfoGiftCardCodeLabel}`}>
              {formatMessage({ id: messages.voucherCode.id })}
            </span>{' '}
            {request.giftCardCode ? (
              <span className={`${styles.requestInfoGiftCardCodeText}`}>
                {request.giftCardCode}
              </span>
            ) : (
              <span className={`${styles.requestInfoGiftCardNotGenerated}`}>
                {formatMessage({ id: messages.voucherCodeNotGenerated.id })}
              </span>
            )}
          </p>
          {request.giftCardCode ? (
            <p
              className={`ma1 t-small c-on-base ${styles.requestInfoGiftCardValue}`}
            >
              <span className={`${styles.requestInfoGiftCardValueLabel}`}>
                {formatMessage({ id: messages.voucherValue.id })}
              </span>{' '}
              <span className={`${styles.requestInfoGiftCardValueText}`}>
                <FormattedCurrency value={giftCardValue} />
              </span>
            </p>
          ) : null}
        </div>
      ) : (
        <p
          className={`ma1 t-small c-on-base ${styles.requestInfoPaymentMethod}`}
        >
          {request.paymentMethod}
        </p>
      )}
      {request.extraComment && request.extraComment !== '' && (
        <div
          className={`flex-ns flex-wrap flex-auto flex-column w-70 mb4 ${styles.returnFormInputsExtraComment}`}
        >
          <p className={`${styles.returnFormInputsHeader}`}>
            <strong>
              {formatMessage({ id: messages.formExtraComment.id })}
            </strong>
          </p>
          <p
            className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
          >
            {decodeURIComponent(request.extraComment)}
          </p>
        </div>
      )}
    </div>
  )
}

export default injectIntl(RequestInfo)

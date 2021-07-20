/* eslint-disable no-console */
import React, { Component } from 'react'
import { FormattedCurrency } from 'vtex.format-currency'
import styles from '../styles.css'
import { defineMessages, injectIntl } from 'react-intl'

interface Props {
  request: any
  giftCardValue: any
  intl: any
}

class RequestInfo extends Component<Props> {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      request,
      giftCardValue,
      intl: { formatMessage },
    } = this.props
    const messages = defineMessages({
      contactDetails: { id: `returns.contactDetails` },
      name: { id: `returns.name` },
      email: { id: `returns.email` },
      phone: { id: `returns.phone` },
      pickupAddress: { id: `returns.pickupAddress` },
      country: { id: `returns.country` },
      locality: { id: `returns.locality` },
      address: { id: `returns.address` },
      state: { id: `returns.state` },
      zip: { id: `returns.zip` },
      parcelDetails: { id: `returns.formParcel` },
      weight: { id: `returns.weight` },
      length: { id: `returns.length` },
      width: { id: `returns.width` },
      height: { id: `returns.height` },
      refundPaymentMethod: {
        id: `returns.refundPaymentMethod`,
        paymentMethod: 'bank',
      },
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
                <span className={`${styles.requestInfoText}`}>
                  {request.zip}
                </span>
              </p>
            </div>
          </div>
          <div
            className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.requestInfoContentColumn} ${styles.requestInfoContentColumnRight}`}
          >
            <p className={`${styles.requestInfoSectionTitle}`}>
              <strong className={`${styles.requestInfoSectionTitleStrong}`}>
                {formatMessage({ id: messages.parcelDetails.id })}
              </strong>
            </p>
            <div className={`mb5 ${styles.requestInfoTextContainer}`}>
              <p
                className={`ma0 t-small c-on-base ${styles.requestInfoTextHolder}`}
              >
                <span className={`${styles.requestInfoTextLabel}`}>
                  {formatMessage({ id: messages.weight.id })}:
                </span>{' '}
                <span className={`${styles.requestInfoText}`}>
                  {request.weight}
                </span>
              </p>
            </div>
            <div className={`mb5 ${styles.requestInfoTextContainer}`}>
              <p
                className={`ma0 t-small c-on-base ${styles.requestInfoTextHolder}`}
              >
                <span className={`${styles.requestInfoTextLabel}`}>
                  {formatMessage({ id: messages.length.id })}:
                </span>{' '}
                <span className={`${styles.requestInfoText}`}>
                  {request.length}
                </span>
              </p>
            </div>
            <div className={`mb5 ${styles.requestInfoTextContainer}`}>
              <p
                className={`ma0 t-small c-on-base ${styles.requestInfoTextHolder}`}
              >
                <span className={`${styles.requestInfoTextLabel}`}>
                  {formatMessage({ id: messages.width.id })}:
                </span>{' '}
                <span className={`${styles.requestInfoText}`}>
                  {request.width}
                </span>
              </p>
            </div>
            <div className={`mb5 ${styles.requestInfoTextContainer}`}>
              <p
                className={`ma0 t-small c-on-base ${styles.requestInfoTextHolder}`}
              >
                <span className={`${styles.requestInfoTextLabel}`}>
                  {formatMessage({ id: messages.height.id })}:
                </span>{' '}
                <span className={`${styles.requestInfoText}`}>
                  {request.height}
                </span>
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
          <div className={`flex-ns flex-wrap flex-auto flex-column mt4`}>
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
      </div>
    )
  }
}

export default injectIntl(RequestInfo)

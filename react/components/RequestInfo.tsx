import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { FormattedMessageFixed, intlArea } from "../common/utils";
import { FormattedCurrency } from "vtex.format-currency";
import styles from "../styles.css";
interface Props {
  request: any;
  giftCardValue: any;
  intl: string;
}

class RequestInfo extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { request, intl, giftCardValue } = this.props;
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
                <FormattedMessageFixed id={`${intl}.contactDetails`} />
              </strong>
            </p>
            <div className={`mb5 ${styles.requestInfoTextContainer}`}>
              <p
                className={`ma0 t-small c-on-base ${styles.requestInfoTextHolder}`}
              >
                <span className={`${styles.requestInfoTextLabel}`}>
                  <FormattedMessageFixed id={`${intl}.name`} />:
                </span>{" "}
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
                  <FormattedMessageFixed id={`${intl}.email`} />:
                </span>{" "}
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
                  <FormattedMessageFixed id={`${intl}.phone`} />:
                </span>{" "}
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
                <FormattedMessageFixed id={`${intl}.pickupAddress`} />
              </strong>
            </p>
            <div className={`mb5 ${styles.requestInfoTextContainer}`}>
              <p
                className={`ma0 t-small c-on-base ${styles.requestInfoTextHolder}`}
              >
                <span className={`${styles.requestInfoTextLabel}`}>
                  <FormattedMessageFixed id={`${intl}.country`} />:
                </span>{" "}
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
                  <FormattedMessageFixed id={`${intl}.locality`} />:
                </span>{" "}
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
                  <FormattedMessageFixed id={`${intl}.address`} />:
                </span>{" "}
                <span className={`${styles.requestInfoText}`}>
                  {request.address}
                </span>
              </p>
            </div>
          </div>
        </div>
        <p
          className={`${styles.requestInfoSectionTitle} ${styles.requestInfoPaymentTitle}`}
        >
          <strong className={`${styles.requestInfoPaymentTitleStrong}`}>
            <FormattedMessageFixed id={`${intl}.refundPaymentMethod`} />
          </strong>
        </p>
        {request.paymentMethod === "bank" ? (
          <div className={`flex-ns flex-wrap flex-auto flex-column mt4`}>
            <p
              className={`ma1 t-small c-on-base ${styles.requestInfoPaymentMethod}`}
            >
              <span className={`${styles.requestInfoPaymentLabel}`}>
                <FormattedMessageFixed id={`${intl}.formBankTransferAccount`} />
              </span>{" "}
              <span className={`${styles.requestInfoIbanText}`}>
                {request.iban}
              </span>
            </p>
          </div>
        ) : request.paymentMethod === "giftCard" ? (
          <div>
            <p
              className={`ma1 t-small c-on-base ${styles.requestInfoPaymentMethod}`}
            >
              <FormattedMessageFixed id={`${intl}.formVoucher`} />
            </p>
            <p
              className={`ma1 t-small c-on-base ${styles.requestInfoGiftCardCode}`}
            >
              <span className={`${styles.requestInfoGiftCardCodeLabel}`}>
                <FormattedMessageFixed id={`${intl}.voucherCode`} />
              </span>{" "}
              {request.giftCardCode ? (
                <span className={`${styles.requestInfoGiftCardCodeText}`}>
                  {request.giftCardCode}
                </span>
              ) : (
                <span className={`${styles.requestInfoGiftCardNotGenerated}`}>
                  <FormattedMessageFixed
                    id={`${intl}.voucherCodeNotGenerated`}
                  />
                </span>
              )}
            </p>
            {request.giftCardCode ? (
              <p
                className={`ma1 t-small c-on-base ${styles.requestInfoGiftCardValue}`}
              >
                <span className={`${styles.requestInfoGiftCardValueLabel}`}>
                  <FormattedMessageFixed id={`${intl}.voucherValue`} />
                </span>{" "}
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
    );
  }
}

export default RequestInfo;

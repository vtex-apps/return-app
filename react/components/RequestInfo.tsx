import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { FormattedMessageFixed, intlArea } from "../common/utils";
import { FormattedCurrency } from "vtex.format-currency";

interface Props {
  request: any;
  giftCardValue: any;
  intl: string;
}

class RequestInfo extends Component<Props> {
  constructor(props) {
    super(props);
  }

  generateEditGiftCardLink = () => {
    const { request }: any = this.props;
    const url = `/admin/Site/ValeForm.aspx?id=${request.giftCardId}`
    return (
      <>
        <a rel="noopener noreferrer" target="_blank" href={url}>
          <FormattedMessage id="admin/returns.chargeGiftCard" />
        </a>
      </>
    );
  };

  render() {
    const { request, intl, giftCardValue } = this.props;
    return (
      <div>
        <div className={`flex-ns flex-wrap flex-row`}>
          <div className={`flex-ns flex-wrap flex-auto flex-column pt4 pb4`}>
            <p>
              <strong>
                <FormattedMessageFixed id={`${intl}.contactDetails`} />
              </strong>
            </p>
            <div className={"mb5"}>
              <p className={"ma0 t-small c-on-base "}>
                <FormattedMessageFixed id={`${intl}.name`} />: {request.name}
              </p>
            </div>
            <div className={"mb5"}>
              <p className={"ma0 t-small c-on-base "}>
                <FormattedMessageFixed id={`${intl}.email`} />: {request.email}
              </p>
            </div>
            <div className={"mb5"}>
              <p className={"ma0 t-small c-on-base "}>
                <FormattedMessageFixed id={`${intl}.phone`} />:{" "}
                {request.phoneNumber}
              </p>
            </div>
          </div>

          <div className={`flex-ns flex-wrap flex-auto flex-column pa4`}>
            <p>
              <strong>
                <FormattedMessageFixed id={`${intl}.pickupAddress`} />
              </strong>
            </p>
            <div className={"mb5"}>
              <p className={"ma0 t-small c-on-base"}>
                <FormattedMessageFixed id={`${intl}.country`} />:{" "}
                {request.country}
              </p>
            </div>
            <div className={"mb5"}>
              <p className={"ma0 t-small c-on-base"}>
                <FormattedMessageFixed id={`${intl}.locality`} />:{" "}
                {request.locality}
              </p>
            </div>
            <div className={"mb5"}>
              <p className={"ma0 t-small c-on-base"}>
                <FormattedMessageFixed id={`${intl}.address`} />:{" "}
                {request.address}
              </p>
            </div>
          </div>
        </div>
        <p>
          <strong>
            <FormattedMessageFixed id={`${intl}.refundPaymentMethod`} />
          </strong>
        </p>
        {request.paymentMethod === "bank" ? (
          <div className={"flex-ns flex-wrap flex-auto flex-column mt4"}>
            <p className={"ma1 t-small c-on-base "}>
              <FormattedMessage id={`${intl}.formBankTransferAccount`} />{" "}
              {request.iban}
            </p>
          </div>
        ) : request.paymentMethod === "giftCard" ? (
          <div>
            <p className={"ma1 t-small c-on-base "}>
              <FormattedMessage id={`${intl}.formVoucher`} />
            </p>
            <p className={`ma1 t-small c-on-base`}>
              <FormattedMessageFixed id={`${intl}.voucherCode`} />{" "}
              {request.giftCardCode ? (
                request.giftCardCode
              ) : (
                <FormattedMessageFixed id={`${intl}.voucherCodeNotGenerated`} />
              )}
            </p>
            {request.giftCardCode ? (
              <p className={`ma1 t-small c-on-base`}>
                <FormattedMessageFixed id={`${intl}.voucherValue`} />{" "}
                <FormattedCurrency value={giftCardValue} />{" "}
                {intl === intlArea.admin
                  ? this.generateEditGiftCardLink()
                  : null}
              </p>
            ) : null}
          </div>
        ) : (
          <p className={"ma1 t-small c-on-base "}>{request.paymentMethod}</p>
        )}
      </div>
    );
  }
}

export default RequestInfo;

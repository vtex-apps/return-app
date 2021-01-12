import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import styles from "../styles.css";
import { FormattedMessageFixed } from "../common/utils";

interface Props {
  request: any;
  intl: string;
}

class RequestInfo extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { request, intl } = this.props;
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
              <FormattedMessageFixed id={`${intl}.formBankTransferAccount`} />{" "}
              {request.iban}
            </p>
          </div>
        ) : (
          <div>
            <p className={"ma1 t-small c-on-base " + styles.capitalize}>
              {request.paymentMethod}{" "}
            </p>
            {request.paymentMethod === "voucher" ? (
              <p className={`ma1 t-small c-on-base`}>
                <FormattedMessageFixed id={`${intl}.voucherCode`} />{" "}
                {request.voucherCode ? (
                  request.voucherCode
                ) : (
                  <FormattedMessageFixed
                    id={`${intl}.voucherCodeNotGenerated`}
                  />
                )}
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

export default RequestInfo;

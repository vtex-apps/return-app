import React, { Component } from "react";
import styles from "../styles.css";
import { FormattedMessage } from "react-intl";
import { Button } from "vtex.styleguide";
import { FormattedMessageFixed } from "../common/utils";

interface Props {
  orderProducts: any;
  showForm: any;
  sendRequest: any;
  errorSubmit: string;
  info: any;
}

class RequestInformation extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      orderProducts,
      info,
      showForm,
      sendRequest,
      errorSubmit
    } = this.props;

    return (
      <div>
        <div>
          <table className={`${styles.table} ${styles.tableInformation}`}>
            <thead className={`${styles.tableThead}`}>
              <tr className={`${styles.tableTr}`}>
                <th className={`${styles.tableTh}`} />
                <th className={`${styles.tableTh}`}>
                  <FormattedMessage id={"store/my-returns.thProduct"} />
                </th>
                <th className={`${styles.tableTh}`}>
                  <FormattedMessage id={"store/my-returns.thQuantity"} />
                </th>
              </tr>
            </thead>
            <tbody className={`${styles.tableTbody}`}>
              {orderProducts.map((product: any) =>
                parseInt(product.selectedQuantity) > 0 ? (
                  <tr
                    key={`product` + product.uniqueId}
                    className={`${styles.tableTr}`}
                  >
                    <td className={`${styles.tableTd} ${styles.tableTdImage}`}>
                      <img
                        className={`${styles.requestInformationImage}`}
                        src={product.imageUrl}
                        alt={product.name}
                      />
                    </td>
                    <td className={`${styles.tableTd}`}>
                      {product.name}
                      <div className={`${styles.reasonStyle} ${styles.mt10}`}>
                        <span className={styles.strongText}>
                          <FormattedMessageFixed
                            id={"store/my-returns.thReason"}
                          />
                          {": "}
                        </span>
                        <FormattedMessageFixed
                          id={`store/my-returns.${product.reasonCode}`}
                        />{" "}
                        {product.reasonCode === "reasonOther"
                          ? "( " + product.reason + " )"
                          : null}
                      </div>
                    </td>
                    <td className={`${styles.tableTd}`}>
                      {product.selectedQuantity} / {product.quantity}
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
          <div
            className={`flex-ns flex-wrap flex-row ${styles.returnFormInputs}`}
          >
            <div
              className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormInputsColumn} ${styles.returnFormInputsColumnLeft}`}
            >
              <p className={`${styles.returnFormInputsHeader}`}>
                <FormattedMessage id={"store/my-returns.formContactDetails"} />
              </p>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  <FormattedMessage id={"store/my-returns.formName"} />:{" "}
                  {info.name}
                </p>
              </div>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  <FormattedMessage id={"store/my-returns.formEmail"} />:{" "}
                  {info.email}
                </p>
              </div>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  <FormattedMessage id={"store/my-returns.formPhone"} />:{" "}
                  {info.phone}
                </p>
              </div>
            </div>

            <div
              className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormInputsColumn} ${styles.returnFormInputsColumnRight}`}
            >
              <p className={`${styles.returnFormInputsHeader}`}>
                <FormattedMessage id={"store/my-returns.formPickupAddress"} />
              </p>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  <FormattedMessage id={"store/my-returns.formCountry"} />:{" "}
                  {info.country}
                </p>
              </div>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  <FormattedMessage id={"store/my-returns.formLocality"} />:{" "}
                  {info.locality}
                </p>
              </div>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  <FormattedMessage id={"store/my-returns.formAddress"} />:{" "}
                  {info.address}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormInputsPayment}`}
          >
            <p className={`${styles.returnFormInputsHeader}`}>
              <FormattedMessage id={"store/my-returns.formPaymentMethod"} />
            </p>
            {info.paymentMethod === "bank" ? (
              <div
                className={`flex-ns flex-wrap flex-auto flex-column mt4 ${styles.returnFormInputIban}`}
              >
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationSelectedPayment}`}
                >
                  <FormattedMessage
                    id={"store/my-returns.formBankTransferAccount"}
                  />{" "}
                  {info.iban}
                </p>
              </div>
            ) : info.paymentMethod === "giftCard" ? (
              <p
                className={`ma1 t-small c-on-base ${styles.requestInformationSelectedPayment}`}
              >
                <FormattedMessage id={"store/my-returns.formVoucher"} />
              </p>
            ) : (
              <p
                className={`ma1 t-small c-on-base ${styles.requestInformationSelectedPayment}`}
              >
                {info.paymentMethod}
              </p>
            )}
          </div>
          <div
            className={`flex-ns flex-wrap flex-auto flex-row justify-between ${styles.tableAddColButton} ${styles.returnFormInfoActions}`}
          >
            <div
              className={`${styles.requestInformationActionColumn} ${styles.requestInformationActionBack}`}
            >
              <Button
                type={"submit"}
                onClick={() => {
                  showForm();
                }}
              >
                <FormattedMessage id={"store/my-returns.goBack"} />
              </Button>
            </div>
            <div
              className={`${styles.requestInformationActionColumn} ${styles.requestInformationActionSubmit}`}
            >
              <Button
                type={"submit"}
                variation="primary"
                onClick={() => {
                  sendRequest();
                }}
              >
                <FormattedMessage id={"store/my-returns.formSubmit"} />
              </Button>
            </div>
          </div>
          {errorSubmit ? (
            <div>
              <p className={styles.errorMessage}>{errorSubmit}</p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default RequestInformation;

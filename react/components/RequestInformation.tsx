import React, { Component } from "react";
import styles from "../styles.css";
import { FormattedMessage } from "react-intl";
import { Button } from "vtex.styleguide";

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
          <table className={styles.table}>
            <thead>
              <tr>
                <th />
                <th>
                  <FormattedMessage id={"store/my-returns.thProduct"} />
                </th>
                <th>
                  <FormattedMessage id={"store/my-returns.thQuantity"} />
                </th>
              </tr>
            </thead>
            <tbody>
              {orderProducts.map((product: any) =>
                parseInt(product.selectedQuantity) > 0 ? (
                  <tr key={`product` + product.uniqueId}>
                    <td>
                      <img src={product.imageUrl} alt={product.name} />
                    </td>
                    <td>{product.name}</td>
                    <td>
                      {product.selectedQuantity} / {product.quantity}
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
          <div className={`flex-ns flex-wrap flex-row`}>
            <div className={`flex-ns flex-wrap flex-auto flex-column pa4`}>
              <p>
                <FormattedMessage id={"store/my-returns.formContactDetails"} />
              </p>
              <div className={"mb2"}>
                <p className={"ma1 t-small c-on-base "}>
                  <FormattedMessage id={"store/my-returns.formName"} />:{" "}
                  {info.name}
                </p>
              </div>
              <div className={"mb2"}>
                <p className={"ma1 t-small c-on-base "}>
                  <FormattedMessage id={"store/my-returns.formEmail"} />:{" "}
                  {info.email}
                </p>
              </div>
              <div className={"mb2"}>
                <p className={"ma1 t-small c-on-base "}>
                  <FormattedMessage id={"store/my-returns.formPhone"} />:{" "}
                  {info.phone}
                </p>
              </div>
            </div>

            <div className={`flex-ns flex-wrap flex-auto flex-column pa4`}>
              <p>
                <FormattedMessage id={"store/my-returns.formPickupAddress"} />
              </p>
              <div className={"mb2"}>
                <p className={"ma1 t-small c-on-base"}>
                  <FormattedMessage id={"store/my-returns.formCountry"} />:{" "}
                  {info.country}
                </p>
              </div>
              <div className={"mb2"}>
                <p className={"ma1 t-small c-on-base"}>
                  <FormattedMessage id={"store/my-returns.formLocality"} />:{" "}
                  {info.locality}
                </p>
              </div>
              <div className={"mb2"}>
                <p className={"ma1 t-small c-on-base"}>
                  <FormattedMessage id={"store/my-returns.formAddress"} />:{" "}
                  {info.address}
                </p>
              </div>
            </div>
          </div>
          <div className={`flex-ns flex-wrap flex-auto flex-column pa4`}>
            <p>
              <FormattedMessage id={"store/my-returns.formPaymentMethod"} />
            </p>
            {info.paymentMethod === "bank" ? (
              <div className={"flex-ns flex-wrap flex-auto flex-column mt4"}>
                <p className={"ma1 t-small c-on-base "}>
                  <FormattedMessage
                    id={"store/my-returns.formBankTransferAccount"}
                  />{" "}
                  {info.iban}
                </p>
              </div>
            ) : (
              <p className={"ma1 t-small c-on-base "}>{info.paymentMethod}</p>
            )}
          </div>
          <div
            className={"flex-ns flex-wrap flex-auto flex-row justify-between"}
          >
            <Button
              type={"submit"}
              onClick={() => {
                showForm();
              }}
            >
              <FormattedMessage id={"store/my-returns.goBack"} />
            </Button>
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

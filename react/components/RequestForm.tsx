import React, { Component } from "react";
import styles from "../styles.css";
import { FormattedMessage } from "react-intl";
import { Button, Checkbox, Input, RadioGroup } from "vtex.styleguide";
import { FormattedMessageFixed, returnFormDate } from "../common/utils";

interface FormInputs {
  name: string;
  email: string;
  phone: string;
  country: string;
  locality: string;
  address: string;
  paymentMethod: string;
  iban: string;
  agree: boolean;
}

interface Props {
  showTable: any;
  selectedOrder: any;
  orderProducts: any;
  handleQuantity: any;
  errors: any;
  handleInputChange: any;
  formInputs: FormInputs;
  submit: any;
  settings: any;
}

class RequestForm extends Component<Props> {
  constructor(props) {
    super(props);
  }

  paymentMethods() {
    const { selectedOrder }: any = this.props;

    const output: any[] = [];

    if (
      selectedOrder.paymentData.transactions[0].payments[0].firstDigits !== null
    ) {
      output.push({
        value: "card",
        label: <FormattedMessage id={"store/my-returns.formCreditCard"} />
      });
    }

    output.push({
      value: "voucher",
      label: <FormattedMessage id={"store/my-returns.formVoucher"} />
    });
    output.push({
      value: "bank",
      label: <FormattedMessage id={"store/my-returns.formBank"} />
    });

    return output;
  }

  renderTermsAndConditions = () => {
    const { settings }: any = this.props;
    return (
      <FormattedMessage
        id="store/my-returns.formAgree"
        values={{
          link: (
            <span>
              {" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={settings.termsUrl}
              >
                <FormattedMessage id="store/my-returns.TermsConditions" />
              </a>
            </span>
          )
        }}
      />
    );
  };

  render() {
    const {
      showTable,
      selectedOrder,
      orderProducts,
      handleQuantity,
      errors,
      handleInputChange,
      formInputs,
      submit
    } = this.props;

    return (
      <div>
        <div className={`mb6 mt4`}>
          <Button
            variation={"secondary"}
            size={"small"}
            onClick={() => showTable()}
          >
            <FormattedMessage id={"store/my-returns.backToOrders"} />
          </Button>
        </div>
        <div
          className={
            `cf w-100 pa5 ph7-ns bb b--muted-4 bg-muted-5 lh-copy o-100 ` +
            styles.orderInfoHeader
          }
        >
          <div className={`flex flex-row`}>
            <div className={`flex flex-column w-50`}>
              <div className={`w-100 f7 f6-xl fw4 c-muted-1 ttu`}>
                <FormattedMessage id={"store/my-returns.orderDate"} />
              </div>
              <div className={`db pv0 f6 fw5 c-on-base f5-l`}>
                {returnFormDate(selectedOrder.creationDate, "store/my-returns")}
              </div>
            </div>
            <div className={`flex flex-column w-50`}>
              <div className={`w-100 f7 f6-xl fw4 c-muted-1 ttu`}>
                <FormattedMessage id={"store/my-returns.thOrderId"} />
              </div>
              <div className={`db pv0 f6 fw5 c-on-base f5-l`}>
                {selectedOrder.orderId}
              </div>
            </div>
          </div>
        </div>
        <div>
          <table className={styles.tblProducts}>
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
              {orderProducts.map((product: any) => (
                <tr key={`product` + product.uniqueId}>
                  <td>
                    <img src={product.imageUrl} alt={product.name} />
                  </td>
                  <td>
                    <a
                      className={styles.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={product.detailUrl}
                    >
                      {product.name}
                    </a>
                  </td>
                  <td>
                    <Input
                      suffix={"/" + product.quantity}
                      size={"small"}
                      type={"number"}
                      value={product.selectedQuantity}
                      onChange={e => {
                        handleQuantity(product, e.target.value);
                      }}
                      max={product.quantity}
                      min={0}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {errors.productQuantities ? (
            <p className={styles.errorMessage}>
              <FormattedMessageFixed id={errors.productQuantities} />
            </p>
          ) : null}
        </div>
        <div className={`flex-ns flex-wrap flex-row`}>
          <div className={`flex-ns flex-wrap flex-auto flex-column pa4`}>
            <p>
              <FormattedMessage id={"store/my-returns.formContactDetails"} />
            </p>
            <div className={"mb4"}>
              <FormattedMessage id={"store/my-returns.formName"}>
                {msg => (
                  <Input
                    name={"name"}
                    placeholder={msg}
                    onChange={handleInputChange}
                    value={formInputs.name}
                    errorMessage={
                      errors.name ? (
                        <FormattedMessageFixed id={errors.name} />
                      ) : (
                        ""
                      )
                    }
                  />
                )}
              </FormattedMessage>
            </div>
            <div className={"mb4"}>
              <FormattedMessage id={"store/my-returns.formEmail"}>
                {msg => (
                  <Input
                    name={"email"}
                    placeholder={msg}
                    onChange={handleInputChange}
                    value={formInputs.email}
                    errorMessage={
                      errors.email ? (
                        <FormattedMessageFixed id={errors.email} />
                      ) : (
                        ""
                      )
                    }
                  />
                )}
              </FormattedMessage>
            </div>
            <div className={"mb4"}>
              <FormattedMessage id={"store/my-returns.formPhone"}>
                {msg => (
                  <Input
                    name={"phone"}
                    placeholder={msg}
                    onChange={handleInputChange}
                    value={formInputs.phone}
                    errorMessage={
                      errors.phone ? (
                        <FormattedMessageFixed id={errors.phone} />
                      ) : (
                        ""
                      )
                    }
                  />
                )}
              </FormattedMessage>
            </div>
          </div>

          <div className={`flex-ns flex-wrap flex-auto flex-column pa4`}>
            <p>
              <FormattedMessage id={"store/my-returns.formPickupAddress"} />
            </p>
            <div className={"mb4"}>
              <FormattedMessage id={"store/my-returns.formCountry"}>
                {msg => (
                  <Input
                    name={"country"}
                    placeholder={msg}
                    onChange={handleInputChange}
                    value={formInputs.country}
                    errorMessage={
                      errors.country ? (
                        <FormattedMessageFixed id={errors.country} />
                      ) : (
                        ""
                      )
                    }
                  />
                )}
              </FormattedMessage>
            </div>
            <div className={"mb4"}>
              <FormattedMessage id={"store/my-returns.formLocality"}>
                {msg => (
                  <Input
                    name={"locality"}
                    placeholder={msg}
                    onChange={handleInputChange}
                    value={formInputs.locality}
                    errorMessage={
                      errors.locality ? (
                        <FormattedMessageFixed id={errors.locality} />
                      ) : (
                        ""
                      )
                    }
                  />
                )}
              </FormattedMessage>
            </div>
            <div className={"mb4"}>
              <FormattedMessage id={"store/my-returns.formAddress"}>
                {msg => (
                  <Input
                    name={"address"}
                    placeholder={msg}
                    onChange={handleInputChange}
                    value={formInputs.address}
                    errorMessage={
                      errors.address ? (
                        <FormattedMessageFixed id={errors.address} />
                      ) : (
                        ""
                      )
                    }
                  />
                )}
              </FormattedMessage>
            </div>
          </div>
        </div>

        <div className={`flex-ns flex-wrap flex-auto flex-column pa4`}>
          <p>
            <FormattedMessage id={"store/my-returns.formPaymentMethod"} />
          </p>
          <RadioGroup
            hideBorder
            name="paymentMethod"
            options={this.paymentMethods()}
            value={formInputs.paymentMethod}
            errorMessage={
              errors.paymentMethod ? (
                <FormattedMessageFixed id={errors.paymentMethod} />
              ) : (
                ""
              )
            }
            onChange={handleInputChange}
          />
          {formInputs.paymentMethod === "bank" ? (
            <div className={"flex-ns flex-wrap flex-auto flex-column mt4"}>
              <FormattedMessage id={"store/my-returns.formIBAN"}>
                {msg => (
                  <Input
                    name={"iban"}
                    placeholder={msg}
                    onChange={handleInputChange}
                    value={formInputs.iban}
                    errorMessage={
                      errors.iban ? (
                        <FormattedMessageFixed id={errors.iban} />
                      ) : (
                        ""
                      )
                    }
                  />
                )}
              </FormattedMessage>
            </div>
          ) : null}
        </div>

        <div className={`flex-ns flex-wrap flex-auto flex-column pa4`}>
          <Checkbox
            checked={formInputs.agree}
            id="agree"
            label={this.renderTermsAndConditions()}
            name="agree"
            onChange={handleInputChange}
            value={formInputs.agree}
          />
          {errors.agree ? (
            <p className={"c-danger t-small mt3 lh-title"}>
              <FormattedMessageFixed id={errors.agree} />
            </p>
          ) : null}
        </div>

        <div className={`mt4 ph4`}>
          <Button type={"submit"} variation="primary" onClick={submit}>
            <FormattedMessage id={"store/my-returns.formNextStep"} />
          </Button>
        </div>
      </div>
    );
  }
}

export default RequestForm;

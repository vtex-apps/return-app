import React, { Component } from "react";
import styles from "../styles.css";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Button,
  Checkbox,
  Input,
  RadioGroup,
  Dropdown,
  Textarea
} from "vtex.styleguide";
import { FormattedMessageFixed, returnFormDate } from "../common/utils";
import PropTypes from "prop-types";

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
  handleReasonCode: any;
  handleReason: any;
  errors: any;
  handleInputChange: any;
  formInputs: FormInputs;
  submit: any;
  settings: any;
  intl: any;
}

class RequestForm extends Component<Props> {
  static propTypes = {
    data: PropTypes.object,
    intl: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  paymentMethods() {
    const { selectedOrder, settings }: any = this.props;

    const output: any[] = [];

    if (
      selectedOrder.paymentData.transactions[0].payments[0].firstDigits !==
        null &&
      settings.paymentsCard
    ) {
      output.push({
        value: "card",
        label: <FormattedMessage id={"store/my-returns.formCreditCard"} />
      });
    }

    if (settings.paymentVoucher) {
      output.push({
        value: "giftCard",
        label: <FormattedMessage id={"store/my-returns.formVoucher"} />
      });
    }
    if (settings.paymentBank) {
      output.push({
        value: "bank",
        label: <FormattedMessage id={"store/my-returns.formBank"} />
      });
    }

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

  renderReasonsDropdown(product: any) {
    const { formatMessage } = this.props.intl;
    const options = [
      {
        value: "reasonAccidentalOrder",
        label: formatMessage({
          id: `store/my-returns.reasonAccidentalOrder`
        })
      },
      {
        value: "reasonBetterPrice",
        label: formatMessage({
          id: `store/my-returns.reasonBetterPrice`
        })
      },
      {
        value: "reasonPerformance",
        label: formatMessage({
          id: `store/my-returns.reasonPerformance`
        })
      },
      {
        value: "reasonIncompatible",
        label: formatMessage({
          id: `store/my-returns.reasonIncompatible`
        })
      },
      {
        value: "reasonItemDamaged",
        label: formatMessage({
          id: `store/my-returns.reasonItemDamaged`
        })
      },
      {
        value: "reasonMissedDelivery",
        label: formatMessage({
          id: `store/my-returns.reasonMissedDelivery`
        })
      },
      {
        value: "reasonMissingParts",
        label: formatMessage({
          id: `store/my-returns.reasonMissingParts`
        })
      },
      {
        value: "reasonBoxDamaged",
        label: formatMessage({
          id: `store/my-returns.reasonBoxDamaged`
        })
      },
      {
        value: "reasonDifferentProduct",
        label: formatMessage({
          id: `store/my-returns.reasonDifferentProduct`
        })
      },
      {
        value: "reasonDefective",
        label: formatMessage({
          id: `store/my-returns.reasonDefective`
        })
      },
      {
        value: "reasonArrivedInAddition",
        label: formatMessage({
          id: `store/my-returns.reasonArrivedInAddition`
        })
      },
      {
        value: "reasonNoLongerNeeded",
        label: formatMessage({
          id: `store/my-returns.reasonNoLongerNeeded`
        })
      },
      {
        value: "reasonUnauthorizedPurchase",
        label: formatMessage({
          id: `store/my-returns.reasonUnauthorizedPurchase`
        })
      },
      {
        value: "reasonDifferentFromWebsite",
        label: formatMessage({
          id: `store/my-returns.reasonDifferentFromWebsite`
        })
      },
      {
        value: "reasonOther",
        label: formatMessage({
          id: `store/my-returns.reasonOther`
        })
      }
    ];

    return (
      <div className={styles.reasonHolder}>
        <Dropdown
          label=""
          size="small"
          options={options}
          value={product.reasonCode}
          errorMessage={
            product.reasonCode === "" && product.selectedQuantity > 0
              ? formatMessage({
                  id: "store/my-returns.formErrorReasonMissing"
                })
              : ""
          }
          onChange={e => {
            this.props.handleReasonCode(product, e.target.value);
          }}
        />
        {product.reasonCode === "reasonOther" ? (
          <div className={styles.mt10}>
            <Textarea
              resize={"none"}
              label=""
              value={product.reason}
              onChange={e => {
                this.props.handleReason(product, e.target.value);
              }}
              errorMessage={
                product.selectedQuantity > 0 &&
                (product.reasonCode === "reasonOther" &&
                  (product.reason === "" ||
                    !product.reason.replace(/\s/g, "").length))
                  ? formatMessage({
                      id: "store/my-returns.formErrorReasonMissing"
                    })
                  : ""
              }
            />
          </div>
        ) : null}
      </div>
    );
  }

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
          className={`cf w-100 pa5 ph7-ns bb b--muted-4 bg-muted-5 lh-copy o-100 ${styles.orderInfoHeader}`}
        >
          <div className={`flex flex-row ${styles.orderInfoHeaderRow}`}>
            <div
              className={`flex flex-column w-50 ${styles.orderInfoHeaderColumn}`}
            >
              <div
                className={`w-100 f7 f6-xl fw4 c-muted-1 ttu ${styles.orderInfoHeaderOrderDateLabel}`}
              >
                <FormattedMessage id={"store/my-returns.orderDate"} />
              </div>
              <div
                className={`db pv0 f6 fw5 c-on-base f5-l ${styles.orderInfoHeaderOrderDate}`}
              >
                {returnFormDate(selectedOrder.creationDate, "store/my-returns")}
              </div>
            </div>
            <div
              className={`flex flex-column w-50 ${styles.orderInfoHeaderColumn}`}
            >
              <div
                className={`w-100 f7 f6-xl fw4 c-muted-1 ttu ${styles.orderInfoHeaderOrderIdLabel}`}
              >
                <FormattedMessage id={"store/my-returns.thOrderId"} />
              </div>
              <div
                className={`db pv0 f6 fw5 c-on-base f5-l ${styles.orderInfoHeaderOrderId}`}
              >
                {selectedOrder.orderId}
              </div>
            </div>
          </div>
        </div>
        <div>
          <table className={styles.tblProducts}>
            <thead className={styles.tableThead}>
              <tr className={styles.tableTr}>
                <th className={styles.tableTh} />
                <th className={styles.tableTh}>
                  <FormattedMessage id={"store/my-returns.thProduct"} />
                </th>
                <th className={styles.tableTh}>
                  <FormattedMessage id={"store/my-returns.thQuantity"} />
                </th>
                <th className={styles.tableTh}>
                  <FormattedMessage id={"store/my-returns.thReason"} />
                </th>
              </tr>
            </thead>
            <tbody className={styles.tableTbody}>
              {orderProducts.map((product: any) => (
                <tr
                  key={`product` + product.uniqueId}
                  className={styles.tableTr}
                >
                  <td className={`${styles.tableTd} ${styles.tableTdImage}`}>
                    <img
                      className={styles.imageCol}
                      src={product.imageUrl}
                      alt={product.name}
                    />
                  </td>
                  <td className={`${styles.tableTd} ${styles.w350}`}>
                    <a
                      className={styles.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={product.detailUrl}
                    >
                      {product.name}
                    </a>
                  </td>
                  <td className={`${styles.tableTd} ${styles.tableTdQuantity}`}>
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
                  <td className={`${styles.tableTd} ${styles.tableTdReason}`}>
                    {this.renderReasonsDropdown(product)}
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
        <div
          className={`flex-ns flex-wrap flex-row ${styles.returnFormInputs}`}
        >
          <div
            className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormInputsColumn} ${styles.returnFormInputsColumnLeft}`}
          >
            <p className={`${styles.returnFormInputsHeader}`}>
              <FormattedMessage id={"store/my-returns.formContactDetails"} />
            </p>
            <div className={`mb4 ${styles.returnFormInput}`}>
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
            <div className={`mb4 ${styles.returnFormInput}`}>
              <FormattedMessage id={"store/my-returns.formEmail"}>
                {msg => (
                  <Input
                    disabled
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
            <div className={`mb4 ${styles.returnFormInput}`}>
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

          <div
            className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormInputsColumn} ${styles.returnFormInputsColumnRight}`}
          >
            <p className={`${styles.returnFormInputsHeader}`}>
              <FormattedMessage id={"store/my-returns.formPickupAddress"} />
            </p>
            <div className={`mb4 ${styles.returnFormInput}`}>
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
            <div className={`mb4 ${styles.returnFormInput}`}>
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
            <div className={`mb4 ${styles.returnFormInput}`}>
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

        <div
          className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormInputsPayment}`}
        >
          <p className={`${styles.returnFormInputsHeader}`}>
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
            <div
              className={`flex-ns flex-wrap flex-auto flex-column mt4 ${styles.returnFormInputIban}`}
            >
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

        <div
          className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormTerms}`}
        >
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

        <div className={`mt4 ph4 ${styles.returnFormActions}`}>
          <Button type={"submit"} variation="primary" onClick={submit}>
            <FormattedMessage id={"store/my-returns.formNextStep"} />
          </Button>
        </div>
      </div>
    );
  }
}

export default injectIntl(RequestForm);

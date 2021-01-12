import React, { Component, useEffect, useState } from "react";
import { ContentWrapper } from "vtex.my-account-commons";
import { Button, Input, RadioGroup, Checkbox, Spinner } from "vtex.styleguide";
import { FormattedMessage } from "react-intl";
import {
  schemaTypes,
  requestsStatuses,
  returnFormDate,
  schemaNames,
  sendMail
} from "../common/utils";
import { isValidIBANNumber } from "../common/validations";
import { countries } from "../common/countries";

import { PageProps } from "../typings/utils";
import styles from "../styles.css";
import { getCurrentDate, diffDays, beautifyDate } from "../common/utils";

function FormattedMessageFixed(props) {
  return <FormattedMessage {...props} />;
}

type Errors = {
  name: string;
  email: string;
  phone: string;
  country: string;
  locality: string;
  address: string;
  paymentMethod: string;
  iban: string;
  agree: string;
  productQuantities: string;
};

type State = {
  showForm: boolean;
  showOrdersTable: boolean;
  showInfo: boolean;
  userId: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  locality: string;
  address: string;
  paymentMethod: string;
  iban: string;
  agree: boolean;
  errorSubmit: string;
  successSubmit: string;
  errors: Errors;
  eligibleOrders: string[];
  selectedOrderId: string;
  selectedOrder: any[];
  orderProducts: any[];
  loading: boolean;
  settings: {};
  currentProduct: {};
  submittedRequest: boolean;
};

const errorMessages = {
  name: {
    id: "store/my-returns.formErrorName"
  },
  email: {
    id: "store/my-returns.formErrorEmail"
  },
  emailInvalid: {
    id: "store/my-returns.formErrorEmailInvalid"
  },
  phone: {
    id: "store/my-returns.formErrorPhone"
  },
  country: {
    id: "store/my-returns.formErrorCountry"
  },
  locality: {
    id: "store/my-returns.formErrorLocality"
  },
  address: {
    id: "store/my-returns.formErrorAddress"
  },
  paymentMethod: {
    id: "store/my-returns.formErrorPaymentMethod"
  },
  iban: {
    id: "store/my-returns.formErrorIBAN"
  },
  agree: {
    id: "store/my-returns.formErrorAgree"
  },
  productQuantities: {
    id: "store/my-returns.formErrorQuantities"
  }
};

const emailValidation = (email: string) => {
  return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  );
};

class MyReturnsPageAdd extends Component<PageProps, State> {
  constructor(props: PageProps & State) {
    super(props);
    this.state = {
      showOrdersTable: true,
      showForm: false,
      showInfo: false,
      userId: "",
      name: "",
      email: "",
      phone: "",
      country: "",
      locality: "",
      address: "",
      paymentMethod: "",
      iban: "",
      agree: false,
      successSubmit: "",
      errorSubmit: "",
      errors: {
        name: "",
        email: "",
        phone: "",
        country: "",
        locality: "",
        address: "",
        paymentMethod: "",
        iban: "",
        agree: "",
        productQuantities: ""
      },
      eligibleOrders: [],
      selectedOrderId: "",
      selectedOrder: [],
      orderProducts: [],
      settings: {},
      loading: false,
      currentProduct: {},
      submittedRequest: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.selectOrder = this.selectOrder.bind(this);
  }

  async getSettings() {
    return await fetch(
      "/returns/getDocuments/" +
        schemaNames.settings +
        "/" +
        schemaTypes.settings +
        "/1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(json => {
        if (json && json[0]) {
          return Promise.resolve(json[0]);
        } else {
          return Promise.resolve(null);
        }
      });
  }

  async getProfile() {
    return await fetch("/no-cache/profileSystem/getProfile")
      .then(response => response.json())
      .then(response => {
        if (response.IsUserDefined) {
          this.setState({
            userId: response.UserId,
            name:
              response.FirstName && response.LastName
                ? response.FirstName + " " + response.LastName
                : "",
            email: response.Email
          });
        }
        return Promise.resolve(response);
      });
  }

  async getOrders(userEmail: string) {
    return await fetch("/api/oms/user/orders?clientEmail=" + userEmail)
      .then(response => response.json())
      .then(res => {
        return Promise.resolve(res);
      });
  }

  async getOrder(orderId: string, userEmail: string) {
    return await fetch(
      "/api/oms/user/orders/" + orderId + "?clientEmail=" + userEmail
    )
      .then(response => response.json())
      .then(res => {
        return Promise.resolve(res);
      });
  }

  selectOrder(order) {
    this.prepareOrderData(order, this.state.settings, false);
    if (order.shippingData.address) {
      const complement =
        order.shippingData.address.complement !== null
          ? ", " + order.shippingData.address.complement
          : "";

      this.setState({
        country: countries[order.shippingData.address.country]
          ? countries[order.shippingData.address.country]
          : order.shippingData.address.country,
        locality: order.shippingData.address.city,
        address:
          order.shippingData.address.street +
          " " +
          order.shippingData.address.number +
          complement
      });
    }

    this.setState({
      selectedOrderId: order.orderId,
      phone: order.clientProfileData.phone,
      name:
        order.clientProfileData.firstName +
        " " +
        order.clientProfileData.lastName,
      selectedOrder: order
    });
    this.showForm();
  }

  prepareOrderData = (
    order: any,
    settings: any,
    updateEligibleOrders: boolean
  ) => {
    const thisOrder = order;
    if (order.shippingData.address) {
      thisOrder.country = order.shippingData.address.country;
      thisOrder.city = order.shippingData.address.city;
      const complement =
        order.shippingData.address.complement !== null
          ? ", " + order.shippingData.address.complement
          : "";
      thisOrder.address =
        order.shippingData.address.street +
        " " +
        order.shippingData.address.number +
        complement;
    }

    const promises = order.items.map((product: any) => {
      return new Promise((resolve, reject) => {
        let categoryCount = 0;
        let eligible = false;
        const excludedCategories = JSON.parse(settings.excludedCategories);
        if (excludedCategories.length) {
          const categories = product.additionalInfo.categories;
          if (categories.length) {
            categories.map((category: any) => {
              const excludedMatch = excludedCategories.filter(
                excl => category.id === excl.id
              );
              if (excludedMatch.length) {
                categoryCount++;
              }
            });
          }
        } else {
          eligible = true;
        }

        eligible = !categoryCount;

        const where =
          "userId=" +
          this.state.userId +
          "__orderId=" +
          order.orderId +
          "__skuId=" +
          product.refId;

        let currentProduct = {
          ...product,
          selectedQuantity: 0
        };

        this.checkProduct(where)
          .then(response => {
            if (response >= product.quantity) {
              eligible = false;
              return eligible;
            } else {
              currentProduct = {
                ...currentProduct,
                quantity: currentProduct.quantity - response
              };
              return eligible;
            }
          })
          .then(isEligible => {
            if (isEligible) {
              resolve(currentProduct);
              return;
            } else {
              resolve(false);
              return;
            }
          });
      });
    });
    Promise.all(promises)
      .then(eligibleProducts => {
        const products = eligibleProducts.filter(product => product);
        const previousOrders = this.state.eligibleOrders;
        if (products.length) {
          if (updateEligibleOrders) {
            previousOrders.push(thisOrder);
            this.setState({
              eligibleOrders: previousOrders
            });
          }
        }
        return { previousOrders, products };
      })
      .then(({ previousOrders, products }) => {
        this.setState({
          orderProducts: products,
          eligibleOrders: previousOrders
        });

        setTimeout(() => {
          this.setState({ loading: false });
        }, 500);
      });
  };

  async checkProduct(where: string) {
    return await fetch(
      "/returns/getDocuments/" +
        schemaNames.product +
        "/" +
        schemaTypes.products +
        "/" +
        where
    )
      .then(response => response.json())
      .then(response => {
        let thisQuantity = 0;
        if (response) {
          response.map((receivedProduct: any) => {
            thisQuantity += receivedProduct.quantity;
          });
        }
        return Promise.resolve(thisQuantity);
      });
  }

  prepareData = () => {
    this.setState({ loading: true });
    const currentDate = getCurrentDate();
    this.getSettings().then(settings => {
      if (settings !== null) {
        this.setState({ settings: settings });
        this.getProfile().then(user => {
          this.getOrders(user.Email).then(orders => {
            if ("list" in orders) {
              if (orders.list.length) {
                orders.list.map((order: any) => {
                  if (
                    diffDays(currentDate, order.creationDate) <=
                    settings.maxDays
                  ) {
                    this.getOrder(order.orderId, user.Email).then(
                      currentOrder => {
                        if (currentOrder.status === "invoiced") {
                          this.prepareOrderData(currentOrder, settings, true);
                        }
                      }
                    );
                  }
                });
              }
            }
          });
        });
      }
    });
  };

  componentDidMount() {
    this.prepareData();
  }

  private resetErrors() {
    this.setState({
      errors: {
        name: "",
        email: "",
        phone: "",
        country: "",
        locality: "",
        address: "",
        paymentMethod: "",
        iban: "",
        agree: "",
        productQuantities: ""
      },
      errorSubmit: "",
      successSubmit: ""
    });
  }

  private validateForm() {
    let errors = false;
    this.resetErrors();

    const {
      name,
      email,
      phone,
      country,
      locality,
      address,
      paymentMethod,
      iban,
      agree,
      orderProducts
    } = this.state;

    if (!name) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          name: errorMessages.name.id
        }
      }));
      errors = true;
    }
    if (!email) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          email: errorMessages.email.id
        }
      }));
      errors = true;
    }

    if (email && !emailValidation(email)) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          email: errorMessages.emailInvalid.id
        }
      }));
      errors = true;
    }

    if (!phone) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          phone: errorMessages.phone.id
        }
      }));
      errors = true;
    }

    if (!country) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          country: errorMessages.country.id
        }
      }));
      errors = true;
    }

    if (!locality) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          locality: errorMessages.locality.id
        }
      }));
      errors = true;
    }

    if (!address) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          address: errorMessages.address.id
        }
      }));
      errors = true;
    }

    if (!paymentMethod) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          paymentMethod: errorMessages.paymentMethod.id
        }
      }));
      errors = true;
    } else if (
      (paymentMethod === "bank" && !iban) ||
      (paymentMethod === "bank" && !isValidIBANNumber(iban))
    ) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          iban: errorMessages.iban.id
        }
      }));
      errors = true;
    }

    if (!agree) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          agree: errorMessages.agree.id
        }
      }));
      errors = true;
    }

    let quantities = 0;

    orderProducts.map((product: any) => {
      quantities += parseInt(product.selectedQuantity);
    });

    if (quantities === 0) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          productQuantities: errorMessages.productQuantities.id
        }
      }));
      errors = true;
    }

    return !errors;
  }

  private handleInputChange(event: any) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ ...this.state, [name]: value });
  }

  private submit() {
    if (this.validateForm()) {
      this.setState({
        showOrdersTable: false,
        showForm: false,
        showInfo: true
      });
    }
  }

  private showTable() {
    this.setState({
      showOrdersTable: true,
      showForm: false,
      showInfo: false
    });
  }

  private showForm() {
    this.resetErrors();
    this.setState({
      showOrdersTable: false,
      showForm: true,
      showInfo: false
    });
  }

  handleQuantity(product: any, quantity: any) {
    this.setState(prevState => ({
      orderProducts: prevState.orderProducts.map(el =>
        el.uniqueId === product.uniqueId
          ? {
              ...el,
              selectedQuantity:
                quantity > product.quantity ? product.quantity : quantity
            }
          : el
      )
    }));
  }

  private sendRequest() {
    let totalPrice = 0;
    this.setState({ errorSubmit: "" });
    const {
      userId,
      selectedOrderId,
      name,
      email,
      phone,
      country,
      locality,
      address,
      paymentMethod,
      iban,
      orderProducts
    } = this.state;
    orderProducts.map((product: any) => {
      totalPrice += product.selectedQuantity * product.sellingPrice;
    });

    const requestData = {
      userId: userId,
      orderId: selectedOrderId,
      name: name,
      email: email,
      phoneNumber: phone,
      country: country,
      locality: locality,
      address: address,
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
      refundedAmount: 0,
      voucherCode: "",
      iban: iban,
      status: requestsStatuses.new,
      dateSubmitted: getCurrentDate(),
      type: schemaTypes.requests
    };

    this.sendData(requestData, schemaNames.request).then(response => {
      if ("DocumentId" in response) {
        this.addStatusHistory(response.DocumentId).then();
        this.submitProductRequest(response.DocumentId)
          .then(() => {
            this.setState({
              successSubmit: "Your request has been successfully sent",
              submittedRequest: true
            });
            sendMail({
              data: { ...requestData, ...response },
              products: orderProducts
            });
          })
          .then(() => {
            this.showTable();
          });
      } else {
        this.setState({
          errorSubmit: "An error occured while processing your request.",
          submittedRequest: true
        });
      }
    });
  }

  async addStatusHistory(DocumentId: string) {
    const { userId } = this.state;
    const bodyData = {
      submittedBy: userId,
      refundId: DocumentId,
      status: requestsStatuses.new,
      dateSubmitted: getCurrentDate(),
      type: schemaTypes.history
    };

    this.sendData(bodyData, schemaNames.history).then();
  }

  async submitProductRequest(DocumentId: string) {
    const { orderProducts, userId, selectedOrderId } = this.state;
    orderProducts.map((product: any) => {
      if (parseInt(product.selectedQuantity) > 0) {
        const productData = {
          userId: userId,
          orderId: selectedOrderId,
          refundId: DocumentId,
          skuId: product.refId,
          skuName: product.name,
          unitPrice: parseInt(product.sellingPrice),
          quantity: parseInt(product.selectedQuantity),
          totalPrice: parseInt(
            String(product.sellingPrice * product.selectedQuantity)
          ),
          goodProducts: 0,
          status: requestsStatuses.new,
          dateSubmitted: getCurrentDate(),
          type: schemaTypes.products
        };

        this.sendData(productData, schemaNames.product).then();
      }
    });
  }

  async sendData(body: any, schema: string) {
    return await fetch("/returns/saveDocuments/" + schema, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        if (json) {
          return Promise.resolve(json);
        } else {
          return Promise.resolve(null);
        }
      });
  }

  renderTermsAndConditions = () => {
    const { settings }: any = this.state;
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
      showOrdersTable,
      showForm,
      showInfo,
      name,
      email,
      phone,
      country,
      locality,
      address,
      paymentMethod,
      iban,
      agree,
      errors,
      eligibleOrders,
      orderProducts,
      loading,
      errorSubmit,
      successSubmit,
      selectedOrder,
      submittedRequest
    }: any = this.state;
    return (
      <ContentWrapper {...this.props.headerConfig}>
        {() => {
          if (loading) {
            return (
              <div className={`flex justify-center pt6 pb6`}>
                <Spinner />
              </div>
            );
          }

          if (submittedRequest) {
            return (
              <div>
                {successSubmit ? (
                  <div>
                    <p className={styles.successMessage}>{successSubmit}</p>
                  </div>
                ) : null}
                <div className={`flex flex-column items-center`}>
                  <span className="mb4">
                    <Button href={"/account#/my-returns"}>
                      <FormattedMessage id={"store/my-returns.backToOrders"} />
                    </Button>
                  </span>
                </div>
              </div>
            );
          }
          return (
            <div>
              {showOrdersTable ? (
                <div>
                  {eligibleOrders.length && !loading ? (
                    <div>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>
                              <FormattedMessage
                                id={"store/my-returns.thOrderId"}
                              />
                            </th>
                            <th>
                              <FormattedMessage
                                id={"store/my-returns.thCreationDate"}
                              />
                            </th>
                            <th>
                              <FormattedMessage
                                id={"store/my-returns.thSelectOrder"}
                              />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {eligibleOrders.map(order => {
                            return (
                              <tr key={order.orderId}>
                                <td>{order.orderId}</td>
                                <td>{beautifyDate(order.creationDate)}</td>
                                <td className={styles.textCenter}>
                                  <Button
                                    onClick={() => this.selectOrder(order)}
                                  >
                                    <FormattedMessage
                                      id={"store/my-returns.thSelectOrder"}
                                    />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div>
                      <FormattedMessage
                        id={"store/my-returns.no_eligible_orders"}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <></>
              )}
              {showForm ? (
                <div>
                  <div className={`mb6 mt4`}>
                    <Button
                      variation={"secondary"}
                      size={"small"}
                      onClick={() => this.showTable()}
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
                          {returnFormDate(selectedOrder.creationDate)}
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
                          <th>
                            <FormattedMessage
                              id={"store/my-returns.thProduct"}
                            />
                          </th>
                          <th>
                            <FormattedMessage
                              id={"store/my-returns.thQuantity"}
                            />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderProducts.map((product: any) => (
                          <tr key={`product` + product.uniqueId}>
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
                                  this.handleQuantity(product, e.target.value);
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
                    <div
                      className={`flex-ns flex-wrap flex-auto flex-column pa4`}
                    >
                      <p>
                        <FormattedMessage
                          id={"store/my-returns.formContactDetails"}
                        />
                      </p>
                      <div className={"mb4"}>
                        <FormattedMessage id={"store/my-returns.formName"}>
                          {msg => (
                            <Input
                              name={"name"}
                              placeholder={msg}
                              onChange={this.handleInputChange}
                              value={name}
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
                              onChange={this.handleInputChange}
                              value={email}
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
                              onChange={this.handleInputChange}
                              value={phone}
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
                      className={`flex-ns flex-wrap flex-auto flex-column pa4`}
                    >
                      <p>
                        <FormattedMessage
                          id={"store/my-returns.formPickupAddress"}
                        />
                      </p>
                      <div className={"mb4"}>
                        <FormattedMessage id={"store/my-returns.formCountry"}>
                          {msg => (
                            <Input
                              name={"country"}
                              placeholder={msg}
                              onChange={this.handleInputChange}
                              value={country}
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
                              onChange={this.handleInputChange}
                              value={locality}
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
                              onChange={this.handleInputChange}
                              value={address}
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
                    className={`flex-ns flex-wrap flex-auto flex-column pa4`}
                  >
                    <p>
                      <FormattedMessage
                        id={"store/my-returns.formPaymentMethod"}
                      />
                    </p>
                    <RadioGroup
                      hideBorder
                      name="paymentMethod"
                      options={[
                        {
                          value: "card",
                          label: (
                            <FormattedMessage
                              id={"store/my-returns.formCreditCard"}
                            />
                          )
                        },
                        {
                          value: "voucher",
                          label: (
                            <FormattedMessage
                              id={"store/my-returns.formVoucher"}
                            />
                          )
                        },
                        {
                          value: "bank",
                          label: (
                            <FormattedMessage
                              id={"store/my-returns.formBank"}
                            />
                          )
                        }
                      ]}
                      value={paymentMethod}
                      errorMessage={
                        errors.paymentMethod ? (
                          <FormattedMessageFixed id={errors.paymentMethod} />
                        ) : (
                          ""
                        )
                      }
                      onChange={this.handleInputChange}
                    />
                    {paymentMethod === "bank" ? (
                      <div
                        className={
                          "flex-ns flex-wrap flex-auto flex-column mt4"
                        }
                      >
                        <FormattedMessage id={"store/my-returns.formIBAN"}>
                          {msg => (
                            <Input
                              name={"iban"}
                              placeholder={msg}
                              onChange={this.handleInputChange}
                              value={iban}
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
                    className={`flex-ns flex-wrap flex-auto flex-column pa4`}
                  >
                    <Checkbox
                      checked={agree}
                      id="agree"
                      label={this.renderTermsAndConditions()}
                      name="agree"
                      onChange={this.handleInputChange}
                      value={agree}
                    />
                    {errors.agree ? (
                      <p className={"c-danger t-small mt3 lh-title"}>
                        <FormattedMessageFixed id={errors.agree} />
                      </p>
                    ) : null}
                  </div>

                  <div className={`mt4`}>
                    <Button
                      type={"submit"}
                      variation="primary"
                      onClick={() => {
                        this.submit();
                      }}
                    >
                      <FormattedMessage id={"store/my-returns.formNextStep"} />
                    </Button>
                  </div>
                </div>
              ) : (
                <></>
              )}
              {showInfo ? (
                <div>
                  <div>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>
                            <FormattedMessage
                              id={"store/my-returns.thProduct"}
                            />
                          </th>
                          <th>
                            <FormattedMessage
                              id={"store/my-returns.thQuantity"}
                            />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderProducts.map((product: any) => (
                          <tr key={`product` + product.uniqueId}>
                            <td>{product.name}</td>
                            <td>
                              {product.selectedQuantity} / {product.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className={`flex-ns flex-wrap flex-row`}>
                      <div
                        className={`flex-ns flex-wrap flex-auto flex-column pa4`}
                      >
                        <p>
                          <FormattedMessage
                            id={"store/my-returns.formContactDetails"}
                          />
                        </p>
                        <div className={"mb2"}>
                          <p className={"ma1 t-small c-on-base "}>
                            <FormattedMessage
                              id={"store/my-returns.formName"}
                            />
                            : {name}
                          </p>
                        </div>
                        <div className={"mb2"}>
                          <p className={"ma1 t-small c-on-base "}>
                            <FormattedMessage
                              id={"store/my-returns.formEmail"}
                            />
                            : {email}
                          </p>
                        </div>
                        <div className={"mb2"}>
                          <p className={"ma1 t-small c-on-base "}>
                            <FormattedMessage
                              id={"store/my-returns.formPhone"}
                            />
                            : {phone}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex-ns flex-wrap flex-auto flex-column pa4`}
                      >
                        <p>
                          <FormattedMessage
                            id={"store/my-returns.formPickupAddress"}
                          />
                        </p>
                        <div className={"mb2"}>
                          <p className={"ma1 t-small c-on-base"}>
                            <FormattedMessage
                              id={"store/my-returns.formCountry"}
                            />
                            : {country}
                          </p>
                        </div>
                        <div className={"mb2"}>
                          <p className={"ma1 t-small c-on-base"}>
                            <FormattedMessage
                              id={"store/my-returns.formLocality"}
                            />
                            : {locality}
                          </p>
                        </div>
                        <div className={"mb2"}>
                          <p className={"ma1 t-small c-on-base"}>
                            <FormattedMessage
                              id={"store/my-returns.formAddress"}
                            />
                            : {address}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex-ns flex-wrap flex-auto flex-column pa4`}
                    >
                      <p>
                        <FormattedMessage
                          id={"store/my-returns.formPaymentMethod"}
                        />
                      </p>
                      {paymentMethod === "bank" ? (
                        <div
                          className={
                            "flex-ns flex-wrap flex-auto flex-column mt4"
                          }
                        >
                          <p className={"ma1 t-small c-on-base "}>
                            <FormattedMessage
                              id={"store/my-returns.formBankTransferAccount"}
                            />{" "}
                            {iban}
                          </p>
                        </div>
                      ) : (
                        <p className={"ma1 t-small c-on-base "}>
                          {paymentMethod}
                        </p>
                      )}
                    </div>
                    <div
                      className={
                        "flex-ns flex-wrap flex-auto flex-row justify-between"
                      }
                    >
                      <Button
                        type={"submit"}
                        onClick={() => {
                          this.showForm();
                        }}
                      >
                        <FormattedMessage id={"store/my-returns.goBack"} />
                      </Button>
                      <Button
                        type={"submit"}
                        variation="primary"
                        onClick={() => {
                          this.sendRequest();
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
              ) : (
                <></>
              )}
            </div>
          );
        }}
      </ContentWrapper>
    );
  }
}

export default MyReturnsPageAdd;

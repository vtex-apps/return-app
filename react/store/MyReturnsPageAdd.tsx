import React, { Component, useEffect, useState } from "react";
import { ContentWrapper } from "vtex.my-account-commons";
import { Button, Input, RadioGroup, Checkbox } from "vtex.styleguide";
import { FormattedMessage } from "react-intl";

import { PageProps } from "../typings/utils";
import styles from "../styles.css";
import { getCurrentDate, diffDays } from "../common/utils";

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
  errors: Errors;
  eligibleOrders: string[];
  selectedOrder: [];
  loading: boolean;
};

const errorMessages = {
  name: {
    id: "store/my-returns.formErrorName",
    default: "Your name is required"
  },
  email: {
    id: "store/my-returns.formErrorEmail",
    default: "Email si required"
  },
  emailInvalid: {
    id: "store/my-returns.formErrorEmailInvalid",
    default: "Invalid email address"
  },
  phone: {
    id: "store/my-returns.formErrorPhone",
    default: "Phone is required"
  },
  country: {
    id: "store/my-returns.formErrorCountry",
    default: "Country is required"
  },
  locality: {
    id: "store/my-returns.formErrorLocality",
    default: "Locality is required"
  },
  address: {
    id: "store/my-returns.formErrorAddress",
    default: "Address is required"
  },
  paymentMethod: {
    id: "store/my-returns.formErrorPaymentMethod",
    default: "Payment method is required"
  },
  iban: {
    id: "store/my-returns.formErrorIBAN",
    default: "IBAN is required"
  },
  agree: {
    id: "store/my-returns.formErrorAgree",
    default: "You must accept our terms and conditions"
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
      errors: {
        name: "",
        email: "",
        phone: "",
        country: "",
        locality: "",
        address: "",
        paymentMethod: "",
        iban: "",
        agree: ""
      },
      eligibleOrders: [],
      selectedOrder: [],
      loading: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.selectOrder = this.selectOrder.bind(this);
  }

  async getSettings() {
    return await fetch("/returns/getDocuments/returnSettings/settings/1", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
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
    this.setState({
      country: order.country,
      locality: order.city,
      phone: order.phone,
      name: order.firstName + " " + order.lastName,
      selectedOrder: order,
      address: order.address
    });
    this.showForm();
  }

  prepareData = () => {
    this.setState({ loading: true });
    const currentDate = getCurrentDate();
    this.getSettings().then(settings => {
      if (settings !== null) {
        this.getProfile().then(user => {
          this.getOrders(user.Email)
            .then(orders => {
              if ("list" in orders) {
                if (orders.list.length) {
                  orders.list.map((order: any) => {
                    if (
                      diffDays(currentDate, order.creationDate) <=
                      settings.maxDays
                    ) {
                      this.getOrder(order.orderId, user.Email).then(
                        currentOrder => {
                          const thisOrder: any = {
                            orderId: currentOrder.orderId,
                            creationDate: currentOrder.creationDate,
                            firstName: currentOrder.clientProfileData.firstName,
                            lastName: currentOrder.clientProfileData.lastName,
                            phone: currentOrder.clientProfileData.phone,
                            address: "",
                            country: "",
                            city: "",
                            orderProducts: []
                          };
                          if (currentOrder.shippingData.address) {
                            thisOrder.country =
                              currentOrder.shippingData.address.country;
                            thisOrder.city =
                              currentOrder.shippingData.address.city;
                            const complement =
                              currentOrder.shippingData.address.complement !==
                              null
                                ? ", " +
                                  currentOrder.shippingData.address.complement
                                : "";
                            thisOrder.address =
                              currentOrder.shippingData.address.street +
                              " " +
                              currentOrder.shippingData.address.number +
                              complement;
                          }
                          currentOrder.items.map((product: any) => {
                            const excludedCategories = JSON.parse(
                              settings.excludedCategories
                            );
                            if (excludedCategories.length) {
                              const categories =
                                product.additionalInfo.categories;
                              if (categories.length) {
                                categories.map((category: any) => {
                                  if (
                                    !settings.excludedCategories.includes(
                                      category.id
                                    )
                                  ) {
                                    thisOrder.orderProducts.push(product);
                                  }
                                });
                              }
                            } else {
                              thisOrder.orderProducts.push(product);
                            }
                          });
                          if (thisOrder.orderProducts) {
                            const previousOrders = this.state.eligibleOrders;
                            previousOrders.push(thisOrder);
                            this.setState({ eligibleOrders: previousOrders });
                          }
                        }
                      );
                    }
                  });
                }
              }
            })
            .then(() => {
              this.setState({ loading: false });
            });
        });
      }
    });
  };

  componentDidMount() {
    this.prepareData();
  }

  private validateForm() {
    let errors = false;
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
        agree: ""
      }
    });

    const {
      name,
      email,
      phone,
      country,
      locality,
      address,
      paymentMethod,
      iban,
      agree
    } = this.state;

    if (!name) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          name: errorMessages.name.default
        }
      }));
      errors = true;
    }
    if (!email) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          email: errorMessages.email.default
        }
      }));
      errors = true;
    }

    if (email && !emailValidation(email)) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          email: errorMessages.emailInvalid.default
        }
      }));
      errors = true;
    }

    if (!phone) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          phone: errorMessages.phone.default
        }
      }));
      errors = true;
    }

    if (!country) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          country: errorMessages.country.default
        }
      }));
      errors = true;
    }

    if (!locality) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          locality: errorMessages.locality.default
        }
      }));
      errors = true;
    }

    if (!address) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          address: errorMessages.address.default
        }
      }));
      errors = true;
    }

    if (!paymentMethod) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          paymentMethod: errorMessages.paymentMethod.default
        }
      }));
      errors = true;
    } else if (paymentMethod === "bank" && !iban) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          iban: errorMessages.iban.default
        }
      }));
      errors = true;
    }

    if (!agree) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          agree: errorMessages.agree.default
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
    this.setState({
      showOrdersTable: false,
      showForm: true,
      showInfo: false
    });
  }

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
      loading
    }: any = this.state;
    return (
      <ContentWrapper {...this.props.headerConfig}>
        {() => {
          if (loading) {
            return <div>Loading...</div>;
          } else {
            return (
              <div>
                {showOrdersTable ? (
                  <div>
                    {eligibleOrders.length ? (
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
                                  <td>{order.creationDate}</td>
                                  <td className={styles.textCenter}>
                                    <button
                                      onClick={() => this.selectOrder(order)}
                                    >
                                      <FormattedMessage
                                        id={"store/my-returns.thSelectOrder"}
                                      />
                                    </button>
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
                    <div>
                      <button onClick={() => this.showTable()}>
                        <FormattedMessage
                          id={"store/my-returns.backToOrders"}
                        />
                      </button>
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
                                errorMessage={errors.name}
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
                                errorMessage={errors.email}
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
                                errorMessage={errors.phone}
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
                                errorMessage={errors.country}
                              />
                            )}
                          </FormattedMessage>
                        </div>
                        <div className={"mb4"}>
                          <FormattedMessage
                            id={"store/my-returns.formLocality"}
                          >
                            {msg => (
                              <Input
                                name={"locality"}
                                placeholder={msg}
                                onChange={this.handleInputChange}
                                value={locality}
                                errorMessage={errors.locality}
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
                                errorMessage={errors.address}
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
                        errorMessage={errors.paymentMethod}
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
                                errorMessage={errors.iban}
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
                        label={
                          <FormattedMessage id={"store/my-returns.formAgree"} />
                        }
                        name="agree"
                        onChange={this.handleInputChange}
                        value={agree}
                      />
                      {errors.agree ? (
                        <p className={"c-danger t-small mt3 lh-title"}>
                          {errors.agree}
                        </p>
                      ) : null}
                    </div>

                    <div className={"flex-ns flex-wrap flex-auto flex-column"}>
                      <Button
                        type={"submit"}
                        variation="primary"
                        onClick={() => {
                          this.submit();
                        }}
                      >
                        <FormattedMessage
                          id={"store/my-returns.formNextStep"}
                        />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {showInfo ? (
                  <div>
                    <div>
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
                                id={"store/my-returns.formName"}
                              />
                              : {email}
                            </p>
                          </div>
                          <div className={"mb2"}>
                            <p className={"ma1 t-small c-on-base "}>
                              <FormattedMessage
                                id={"store/my-returns.formEmail"}
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
                          Go Back
                        </Button>
                        <Button
                          type={"submit"}
                          variation="primary"
                          onClick={() => {
                            console.log(this.state);
                          }}
                        >
                          <FormattedMessage
                            id={"store/my-returns.formSubmit"}
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            );
          }
        }}
      </ContentWrapper>
    );
  }
}

export default MyReturnsPageAdd;

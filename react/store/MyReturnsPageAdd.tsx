import React, { Component, useEffect, useState } from "react";
import { ContentWrapper } from "vtex.my-account-commons";
import { PageProps } from "../typings/utils";
import { Button, Input, RadioGroup, Checkbox } from "vtex.styleguide";

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
};

const errorMessages = {
  name: "Your name is required",
  email: "Email si required",
  emailInvalid: "Invalid email address",
  phone: "Phone is required",
  country: "Country is required",
  locality: "Locality is required",
  address: "Address is required",
  paymentMethod: "Payment method is required",
  iban: "IBAN is required",
  agree: "You must accept our terms and conditions"
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
      showForm: true,
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
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    fetch("/no-cache/profileSystem/getProfile")
      .then(response => response.json())
      .then(async response => {
        if (response.IsUserDefined) {
          this.setState({
            userId: response.UserId,
            name: response.FirstName + " " + response.LastName,
            email: response.Email
          });
        }
      });
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
          name: errorMessages.name
        }
      }));
      errors = true;
    }
    if (!email) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          email: errorMessages.email
        }
      }));
      errors = true;
    }

    if (email && !emailValidation(email)) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          email: errorMessages.emailInvalid
        }
      }));
      errors = true;
    }

    if (!phone) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          phone: errorMessages.phone
        }
      }));
      errors = true;
    }

    if (!country) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          country: errorMessages.country
        }
      }));
      errors = true;
    }

    if (!locality) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          locality: errorMessages.locality
        }
      }));
      errors = true;
    }

    if (!address) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          address: errorMessages.address
        }
      }));
      errors = true;
    }

    if (!paymentMethod) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          paymentMethod: errorMessages.paymentMethod
        }
      }));
      errors = true;
    } else if (paymentMethod === "bank" && !iban) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          iban: errorMessages.iban
        }
      }));
      errors = true;
    }

    if (!agree) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          agree: errorMessages.agree
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
        showForm: false,
        showInfo: true
      });
    }
  }

  private showForm() {
    this.setState({
      showForm: true,
      showInfo: false
    });
  }

  render() {
    const {
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
      errors
    }: any = this.state;
    return (
      <ContentWrapper {...this.props.headerConfig}>
        {() => {
          return (
            <div>
              {showForm ? (
                <div>
                  <div className={`flex-ns flex-wrap flex-row`}>
                    <div
                      className={`flex-ns flex-wrap flex-auto flex-column pa4`}
                    >
                      <p>Contact details</p>
                      <div className={"mb4"}>
                        <Input
                          name={"name"}
                          placeholder={"Name"}
                          onChange={this.handleInputChange}
                          value={name}
                          errorMessage={errors.name}
                        />
                      </div>
                      <div className={"mb4"}>
                        <Input
                          name={"email"}
                          placeholder={"Email"}
                          onChange={this.handleInputChange}
                          value={email}
                          errorMessage={errors.email}
                        />
                      </div>
                      <div className={"mb4"}>
                        <Input
                          name={"phone"}
                          placeholder={"Phone"}
                          onChange={this.handleInputChange}
                          value={phone}
                          errorMessage={errors.phone}
                        />
                      </div>
                    </div>

                    <div
                      className={`flex-ns flex-wrap flex-auto flex-column pa4`}
                    >
                      <p>Pickup address</p>
                      <div className={"mb4"}>
                        <Input
                          name={"country"}
                          placeholder={"Country"}
                          onChange={this.handleInputChange}
                          value={country}
                          errorMessage={errors.country}
                        />
                      </div>
                      <div className={"mb4"}>
                        <Input
                          name={"locality"}
                          placeholder={"Locality"}
                          onChange={this.handleInputChange}
                          value={locality}
                          errorMessage={errors.locality}
                        />
                      </div>
                      <div className={"mb4"}>
                        <Input
                          name={"address"}
                          placeholder={"Address"}
                          onChange={this.handleInputChange}
                          value={address}
                          errorMessage={errors.address}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex-ns flex-wrap flex-auto flex-column pa4`}
                  >
                    <p>Refund payment method</p>
                    <RadioGroup
                      hideBorder
                      name="paymentMethod"
                      options={[
                        {
                          value: "card",
                          label: "Credit or debit card used in order purchase"
                        },
                        { value: "voucher", label: "Voucher" },
                        { value: "bank", label: "Bank Transfer" }
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
                        <Input
                          name={"iban"}
                          placeholder={"IBAN"}
                          onChange={this.handleInputChange}
                          value={iban}
                          errorMessage={errors.iban}
                        />
                      </div>
                    ) : null}
                  </div>

                  <div
                    className={`flex-ns flex-wrap flex-auto flex-column pa4`}
                  >
                    <Checkbox
                      checked={agree}
                      id="agree"
                      label="I have read and accept the terms and conditions"
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
                      Next step
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
                        <p>Contact details</p>
                        <div className={"mb2"}>
                          <p className={"ma1 t-small c-on-base "}>
                            Name: {name}
                          </p>
                        </div>
                        <div className={"mb2"}>
                          <p className={"ma1 t-small c-on-base "}>
                            Email address: {email}
                          </p>
                        </div>
                        <div className={"mb2"}>
                          <p className={"ma1 t-small c-on-base "}>
                            Phone number: {phone}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex-ns flex-wrap flex-auto flex-column pa4`}
                      >
                        <p>Pickup address</p>
                        <div className={"mb2"}>
                          <p className={"ma1 t-small c-on-base"}>
                            Country: {country}
                          </p>
                        </div>
                        <div className={"mb2"}>
                          <p className={"ma1 t-small c-on-base"}>
                            Locality: {locality}
                          </p>
                        </div>
                        <div className={"mb2"}>
                          <p className={"ma1 t-small c-on-base"}>
                            Address: {address}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex-ns flex-wrap flex-auto flex-column pa4`}
                    >
                      <p>Refund payment method</p>
                      {paymentMethod === "bank" ? (
                        <div
                          className={
                            "flex-ns flex-wrap flex-auto flex-column mt4"
                          }
                        >
                          <p className={"ma1 t-small c-on-base "}>
                            Bank transfer into account: {iban}
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
                        Submit request
                      </Button>
                    </div>
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

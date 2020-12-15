import React, { Component, useEffect } from "react";
import styles from "../styles.css";
import { FormattedMessage } from "react-intl";
import { Button } from "vtex.styleguide";

class MyReturnsPage extends Component<{}, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      profile: {
        Email: "",
        FirstName: "",
        Gender: "",
        IsReturningUser: false,
        IsUserDefined: false,
        LastName: "",
        UserId: ""
      },
      requests: {}
    };
  }

  componentDidMount() {
    this.getProfile();
  }

  getProfile = () => {
    fetch("/no-cache/profileSystem/getProfile")
      .then(response => response.json())
      .then(async response => {
        if (response.IsUserDefined) {
          this.setState((prevState: any) => ({
            profile: {
              ...prevState.profile,
              Email: response.Email,
              FirstName: response.FirstName,
              Gender: response.Gender,
              IsReturningUser: response.IsReturningUser,
              IsUserDefined: response.IsUserDefined,
              LastName: response.LastName,
              UserId: response.UserId
            }
          }));

          const where = "userId=" + response.UserId;

          fetch("/returns/getDocuments/returnRequests/request/" + where)
            .then(response => response.json())
            .then(async response => {
              this.setState({ requests: response });
            });
        }
      });
  };

  render() {
    const { requests } = this.state;
    return (
      <div>
        <div>
          <h2 className={`w-auto`}>
            <FormattedMessage id="store/my-returns.pageTitle" />
          </h2>
        </div>
        <div className={`flex justify-end mb3`}>
          <Button
            variation="primary"
            size="small"
            href="/account#/my-returns/add"
          >
            <FormattedMessage id="store/my-returns.addReturn" />
          </Button>
        </div>
        {requests.length ? (
          <div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <FormattedMessage id={"store/my-returns.thOrderId"} />
                  </th>
                  <th>
                    <FormattedMessage id={"store/my-returns.thTotalAmount"} />
                  </th>
                  <th>
                    <FormattedMessage
                      id={"store/my-returns.thRefundedAmount"}
                    />
                  </th>
                  <th>
                    <FormattedMessage id={"store/my-returns.thStatus"} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request: any) => (
                  <tr key={request.id}>
                    <td>{request.orderId}</td>
                    <td>{request.totalPrice}</td>
                    <td>{request.refundedAmount}</td>
                    <td>{request.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h4>
            <FormattedMessage id="store/my-returns.no_returns" />
          </h4>
        )}
      </div>
    );
  }
}

export default MyReturnsPage;

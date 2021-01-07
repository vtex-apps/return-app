import React, { Component, useEffect } from "react";
import styles from "../styles.css";
import { FormattedMessage } from "react-intl";
import { Button, Link } from "vtex.styleguide";
import { FormattedCurrency } from "vtex.format-currency";
import {
  requestsStatuses,
  returnFormDate,
  schemaNames,
  schemaTypes
} from "../common/utils";

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

          fetch(
            "/returns/getDocuments/" +
              schemaNames.request +
              "/" +
              schemaTypes.requests +
              "/" +
              where
          )
            .then(response => response.json())
            .then(async response => {
              this.setState({ requests: response });
            });
        }
      });
  };

  renderStatusIcon(status: string) {
    return (
      <span
        className={
          status === requestsStatuses.denied
            ? styles.iconStatusRed
            : styles.iconStatusGreen
        }
      />
    );
  }

  render() {
    const { requests } = this.state;
    return (
      <div className={styles.myReturnsHolder}>
        <div>
          <h2 className={`w-auto`}>
            <FormattedMessage id="store/my-returns.pageTitle" />{" "}
            <span className={styles.totalRequestsNumber}>
              {requests.length} <FormattedMessage id="store/my-returns.total" />
            </span>
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
                    <FormattedMessage id={"store/my-returns.thRequestNo"} />
                  </th>
                  <th>
                    <FormattedMessage id={"store/my-returns.thDate"} />
                  </th>
                  <th>
                    <FormattedMessage id={"store/my-returns.thStatus"} />
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request: any) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{returnFormDate(request.dateSubmitted)}</td>
                    <td>
                      {this.renderStatusIcon(request.status)} {request.status}
                    </td>
                    <td className={styles.textCenter}>
                      <Link href={`account#/my-returns/details/` + request.id}>
                        <FormattedMessage id={"store/my-returns.view"} />
                      </Link>
                    </td>
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

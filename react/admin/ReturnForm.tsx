import React, { Component } from "react";
import PropTypes from "prop-types";
import { returnFormDate, schemaTypes, requestsStatuses } from "../common/utils";
import styles from "../styles.css";
import { FormattedMessage } from "react-intl";
import { FormattedCurrency } from "vtex.format-currency";
import {
  IconSuccess,
  IconFailure,
  IconWarning,
  IconClock,
  IconCheck,
  IconVisibilityOn,
  Link
} from "vtex.styleguide";

export default class ReturnForm extends Component<{}, any> {
  static propTypes = {
    data: PropTypes.object,
    intl: PropTypes.object
  };

  constructor(props: any) {
    super(props);
    this.state = {
      request: {},
      comment: [],
      product: [],
      statusHistory: [],
      error: "",
      totalRefundAmount: 0
    };
  }

  componentDidMount(): void {
    const requestId = this.props["data"]["params"]["id"];
    this.getFromMasterData("returnRequests", schemaTypes.requests, requestId);
    this.getFromMasterData("returnProducts", schemaTypes.products, requestId);
    this.getFromMasterData("returnComments", schemaTypes.comments, requestId);
    this.getFromMasterData(
      "returnStatusHistory",
      schemaTypes.history,
      requestId
    );
    setTimeout(() => {
      this.getTotalRefundAmount();
    }, 500);
  }

  getTotalRefundAmount() {
    let total = 0;
    const { product } = this.state;
    if (product.length) {
      product.map(currentProduct => {
        total += currentProduct.quantity * currentProduct.unitPrice;
      });
    }

    this.setState({ totalRefundAmount: total });
    return total;
  }

  getFromMasterData(schema: string, type: string, refundId: string) {
    const isRequest = schema === "returnRequests";
    const whereField = isRequest ? "id" : "refundId";
    fetch(
      "/returns/getDocuments/" +
        schema +
        "/" +
        type +
        "/" +
        whereField +
        "=" +
        refundId,
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
        this.setState({ [type]: isRequest ? json[0] : json });
      })
      .catch(err => this.setState({ error: err }));
  }

  renderIcon(status: string) {
    if (status === requestsStatuses.approved) {
      return (
        <div>
          <span className={styles.statusApproved}>
            <IconSuccess size={14} /> {status}
          </span>
        </div>
      );
    }

    if (status === requestsStatuses.denied) {
      return (
        <div>
          <span className={styles.statusDenied}>
            <IconFailure size={14} /> {status}
          </span>
        </div>
      );
    }

    if (status === requestsStatuses.partiallyApproved) {
      return (
        <div>
          <span className={styles.statusPartiallyApproved}>
            <IconWarning size={14} /> {status}
          </span>
        </div>
      );
    }

    if (status === requestsStatuses.pendingVerification) {
      return (
        <div>
          <span className={styles.statusPendingVerification}>
            <IconClock size={14} /> {status}
          </span>
        </div>
      );
    }

    return (
      <div>
        <span className={styles.statusNew}>
          <IconVisibilityOn size={14} /> {status}
        </span>
      </div>
    );
  }

  render() {
    const { request, product, totalRefundAmount } = this.state;
    if (!request) {
      return <div>Not Found</div>;
    }
    return (
      <div>
        <p>
          <FormattedMessage id={"admin/returns.back"} />
        </p>
        <p>
          Return form #{request.id} / {returnFormDate(request.dateSubmitted)}
        </p>
        <table
          className={
            styles.table + " " + styles.tableSm + " " + styles.tableProducts
          }
        >
          <thead>
            <tr>
              <th>
                <FormattedMessage id={"admin/returns.product"} />
              </th>
              <th>
                <FormattedMessage id={"admin/returns.quantity"} />
              </th>
              <th>
                <FormattedMessage id={"admin/returns.unitPrice"} />
              </th>
              <th>
                <FormattedMessage id={"admin/returns.subtotalRefund"} />
              </th>
              <th>
                <FormattedMessage
                  id={"admin/returns.productVerificationStatus"}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {product.length ? (
              product.map(currentProduct => (
                <tr key={currentProduct.skuId}>
                  <td className={styles.tableProductColumn}>
                    {currentProduct.skuName}
                  </td>
                  <td className={styles.textCenter}>
                    {currentProduct.quantity}
                  </td>
                  <td className={styles.textCenter}>
                    <FormattedCurrency value={currentProduct.unitPrice / 100} />
                  </td>
                  <td>
                    <FormattedCurrency
                      value={
                        (currentProduct.unitPrice * currentProduct.quantity) /
                        100
                      }
                    />
                  </td>
                  <td>{this.renderIcon(currentProduct.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.textCenter}>
                  No products
                </td>
              </tr>
            )}
            <tr className={styles.tableProductsRow}>
              <td colSpan={3}>
                <strong>
                  <FormattedMessage id={"admin/returns.totalRefundAmount"} />
                </strong>
              </td>
              <td colSpan={2}>
                <strong>
                  <FormattedCurrency value={totalRefundAmount / 100} />
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
        <p className={"mt7"}>
          <strong className={"mr6"}>Reference Order: #{request.orderId}</strong>
          <Link
            href={"/admin/checkout/#/orders/" + request.orderId}
            target="_blank"
          >
            view order
          </Link>
        </p>
        <div className={`flex-ns flex-wrap flex-row`}>
          <div className={`flex-ns flex-wrap flex-auto flex-column pt4 pb4`}>
            <p>
              <strong>
                <FormattedMessage id={"admin/returns.contactDetails"} />
              </strong>
            </p>
            <div className={"mb5"}>
              <p className={"ma0 t-small c-on-base "}>
                <FormattedMessage id={"admin/returns.name"} />: {request.name}
              </p>
            </div>
            <div className={"mb5"}>
              <p className={"ma0 t-small c-on-base "}>
                <FormattedMessage id={"admin/returns.email"} />: {request.email}
              </p>
            </div>
            <div className={"mb5"}>
              <p className={"ma0 t-small c-on-base "}>
                <FormattedMessage id={"admin/returns.phone"} />:{" "}
                {request.phoneNumber}
              </p>
            </div>
          </div>

          <div className={`flex-ns flex-wrap flex-auto flex-column pa4`}>
            <p>
              <strong>
                <FormattedMessage id={"admin/returns.pickupAddress"} />
              </strong>
            </p>
            <div className={"mb5"}>
              <p className={"ma0 t-small c-on-base"}>
                <FormattedMessage id={"admin/returns.country"} />:{" "}
                {request.country}
              </p>
            </div>
            <div className={"mb5"}>
              <p className={"ma0 t-small c-on-base"}>
                <FormattedMessage id={"admin/returns.locality"} />:{" "}
                {request.locality}
              </p>
            </div>
            <div className={"mb5"}>
              <p className={"ma0 t-small c-on-base"}>
                <FormattedMessage id={"admin/returns.address"} />:{" "}
                {request.address}
              </p>
            </div>
          </div>
        </div>
        <p>
          <strong>
            <FormattedMessage id={"admin/returns.refundPaymentMethod"} />
          </strong>
        </p>
        {request.paymentMethod === "bank" ? (
          <div className={"flex-ns flex-wrap flex-auto flex-column mt4"}>
            <p className={"ma1 t-small c-on-base "}>
              <FormattedMessage
                id={"store/my-returns.formBankTransferAccount"}
              />{" "}
              {request.iban}
            </p>
          </div>
        ) : (
          <p className={"ma1 t-small c-on-base " + styles.capitalize}>
            {request.paymentMethod}
          </p>
        )}

        <p>
          <strong>
            <FormattedMessage id={"admin/returns.status"} />
          </strong>
        </p>

        <div>
          <div>
            <p className={styles.statusLine}>
              <span
                className={styles.statusIcon + " " + styles.statusIconChecked}
              >
                <IconCheck size={20} color={"#fff"} />
              </span>
              Return form registered on 1 January 2020
            </p>
            <ul className={styles.statusUl}>
              <li>Comment 1</li>
              <li>Comment 2</li>
              <li>Comment 3</li>
            </ul>
          </div>
          <div>
            <p className={styles.statusLine}>
              <span className={styles.statusIcon} />
              Picked up from client
            </p>
            <ul className={styles.statusUl}>
              <li></li>
            </ul>
          </div>
          <div>
            <p className={styles.statusLine}>
              <span className={styles.statusIcon} />
              Package Verified
            </p>
            <ul className={styles.statusUl}>
              <li>Comment 1</li>
              <li>Comment 2</li>
            </ul>
          </div>
          <div>
            <p className={styles.statusLine}>
              <span className={styles.statusIcon} />
              Amount refunded
            </p>
            <ul className={styles.statusUl}>
              <li>Comment 1</li>
              <li>Comment 2</li>
              <li>Comment 3</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

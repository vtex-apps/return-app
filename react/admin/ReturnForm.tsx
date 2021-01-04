import React, { Component, useEffect } from "react";
import PropTypes from "prop-types";
import {
  returnFormDate,
  schemaTypes,
  requestsStatuses,
  statusHistoryTimeline,
  getCurrentDate
} from "../common/utils";
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
  Link,
  Dropdown,
  Checkbox,
  Textarea,
  Button
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
      statusHistoryTimeline: [],
      error: "",
      totalRefundAmount: 0,
      statusInput: "",
      commentInput: "",
      visibleInput: false,
      registeredUser: "",
      errorCommentMessage: ""
    };
  }

  componentDidMount(): void {
    this.getProfile().then();
    this.getFullData();
  }

  getFullData() {
    const requestId = this.props["data"]["params"]["id"];
    this.getFromMasterData(
      "returnRequests",
      schemaTypes.requests,
      requestId
    ).then(request => {
      this.setState({
        statusInput: request[0].status,
        commentInput: "",
        visibleInput: false
      });
      this.getFromMasterData(
        "returnProducts",
        schemaTypes.products,
        requestId
      ).then(response => {
        let total = 0;
        if (response.length) {
          response.map(currentProduct => {
            total += currentProduct.quantity * currentProduct.unitPrice;
          });
          this.setState({ totalRefundAmount: total });

          this.getFromMasterData(
            "returnComments",
            schemaTypes.comments,
            requestId
          ).then(comments => {
            this.prepareHistoryData(comments, request[0]);
            this.getFromMasterData(
              "returnStatusHistory",
              schemaTypes.history,
              requestId
            ).then();
          });
        }
      });
    });
  }

  async getProfile() {
    return await fetch("/no-cache/profileSystem/getProfile")
      .then(response => response.json())
      .then(response => {
        if (response.IsUserDefined) {
          this.setState({
            registeredUser: response.FirstName + " " + response.LastName
          });
        }
        return Promise.resolve(response);
      });
  }

  async getFromMasterData(schema: string, type: string, refundId: string) {
    const isRequest = schema === "returnRequests";
    const whereField = isRequest ? "id" : "refundId";
    return await fetch(
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
        return json;
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

  prepareHistoryData(comment: any, request: any) {
    const history = [
      {
        status: statusHistoryTimeline.new,
        step: 1,
        comments: comment.filter(item => item.status === requestsStatuses.new),
        active: 1
      },
      {
        status: statusHistoryTimeline.picked,
        step: 2,
        comments: comment.filter(
          item => item.status === requestsStatuses.pendingVerification
        ),
        active:
          request.status === requestsStatuses.pendingVerification ||
          request.status === requestsStatuses.partiallyApproved ||
          request.status === requestsStatuses.approved ||
          request.status === requestsStatuses.denied ||
          request.status === requestsStatuses.refunded
            ? 1
            : 0
      },
      {
        status: statusHistoryTimeline.verified,
        step: 3,
        comments: comment.filter(
          item =>
            item.status === requestsStatuses.partiallyApproved ||
            item.status === requestsStatuses.approved ||
            item.status === requestsStatuses.denied
        ),
        active:
          request.status === requestsStatuses.partiallyApproved ||
          request.status === requestsStatuses.approved ||
          request.status === requestsStatuses.denied ||
          request.status === requestsStatuses.refunded
            ? 1
            : 0
      },
      {
        status: statusHistoryTimeline.refunded,
        step: 4,
        comments: comment.filter(
          item => item.status === requestsStatuses.refunded
        ),
        active: request.status === requestsStatuses.refunded ? 1 : 0
      }
    ];
    this.setState({ statusHistoryTimeline: history });
  }

  submitStatusCommentForm() {
    this.setState({ errorCommentMessage: "" });
    const {
      commentInput,
      visibleInput,
      statusInput,
      request,
      registeredUser,
      comment
    } = this.state;

    let requestData = request;
    let oldComments = comment;

    if (statusInput !== request.status || commentInput !== "") {
      if (statusInput !== request.status) {
        requestData = { ...requestData, status: statusInput };
        const statusHistoryData = {
          refundId: request.id,
          status: statusInput,
          submittedBy: registeredUser,
          dateSubmitted: getCurrentDate(),
          type: schemaTypes.history
        };
        this.updateDocument(request.id, requestData);
        this.saveMasterData("returnStatusHistory", statusHistoryData);
        this.setState({
          request: requestData,
          statusHistory: [...this.state.statusHistory, statusHistoryData]
        });
      }

      if (commentInput !== "") {
        const commentData = {
          refundId: request.id,
          status: statusInput,
          comment: commentInput,
          visibleForCustomer: visibleInput,
          submittedBy: registeredUser,
          dateSubmitted: getCurrentDate(),
          type: schemaTypes.comments
        };
        oldComments = [...oldComments, commentData];
        this.setState({ comment: oldComments, commentInput: "" });
        this.saveMasterData("returnComments", commentData);
      }

      this.prepareHistoryData(oldComments, requestData);
    } else {
      this.setState({
        errorCommentMessage:
          "You need to change the current status or leave a comment"
      });
    }
  }

  saveMasterData = (schema: string, body: any) => {
    fetch("/returns/saveDocuments/" + schema, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }).then(response => {});
  };

  updateDocument = (documentId: string, postData: any) => {
    fetch("/returns/updateDocuments/" + documentId, {
      method: "PUT",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => {})
      .catch(err => err);
  };

  renderStatusCommentForm() {
    const {
      request,
      statusInput,
      commentInput,
      visibleInput,
      errorCommentMessage
    } = this.state;
    const statusesOptions: any[] = [];
    Object.keys(requestsStatuses).map(function(key) {
      statusesOptions.push({
        label:
          requestsStatuses[key] === request.status
            ? requestsStatuses[key] + " (current status)"
            : requestsStatuses[key],
        value: requestsStatuses[key]
      });
    });

    return (
      <div>
        <p className={"mt7"}>
          <strong className={"mr6"}>
            <FormattedMessage id={"admin/returns.changeStatusComment"} />
          </strong>
        </p>
        <div className={`flex flex-row items-stretch`}>
          <div className={`flex flex-column items-stretch w-50`}>
            <div className={`mb6`}>
              <Dropdown
                size="small"
                options={statusesOptions}
                value={statusInput}
                onChange={(_, v) => this.setState({ statusInput: v })}
              />
            </div>
            <div className={`mb6`}>
              <Textarea
                label="Add comment"
                value={commentInput}
                onChange={e => this.setState({ commentInput: e.target.value })}
              />
            </div>
            <div className={`mb6`}>
              <Checkbox
                checked={visibleInput}
                id="visible-input"
                label="Comment visible to client"
                name="default-checkbox-group"
                onChange={e =>
                  this.setState({ visibleInput: !this.state.visibleInput })
                }
                value="1"
              />
            </div>
            <div>
              {errorCommentMessage ? (
                <div className={`mb6`}>
                  <p className={styles.errorMessage}>{errorCommentMessage}</p>
                </div>
              ) : null}
              <Button onClick={() => this.submitStatusCommentForm()}>
                <FormattedMessage id={"admin/returns.addCommentButton"} />
              </Button>
            </div>
          </div>
          <div className={`flex flex-column items-stretch w-50`} />
        </div>
      </div>
    );
  }

  render() {
    const {
      request,
      product,
      totalRefundAmount,
      statusHistoryTimeline,
      statusHistory
    } = this.state;
    if (!request) {
      return <div>Not Found</div>;
    }
    return (
      <div>
        <Button variation="primary" size="small" href="/admin/returns/requests">
          <FormattedMessage id={"admin/returns.back"} />
        </Button>
        <p>
          <FormattedMessage
            id={"admin/returns.details.returnForm"}
            values={{
              requestId: " #" + request.id,
              requestDate: " " + returnFormDate(request.dateSubmitted)
            }}
          />
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
                  <FormattedMessage id={"admin/returns.noProducts"} />
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
          <strong className={"mr6"}>
            <FormattedMessage
              id={"admin/returns.refOrder"}
              values={{ orderId: " #" + request.orderId }}
            />
          </strong>
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

        <p className={"mt7"}>
          <strong>
            <FormattedMessage id={"admin/returns.status"} />
          </strong>
        </p>

        <div>
          {statusHistoryTimeline.map((currentHistory, i) => (
            <div key={`statusHistoryTimeline_` + i}>
              <p className={styles.statusLine}>
                {currentHistory.active ? (
                  <span
                    className={
                      styles.statusIcon + " " + styles.statusIconChecked
                    }
                  >
                    <IconCheck size={20} color={"#fff"} />
                  </span>
                ) : (
                  <span className={styles.statusIcon} />
                )}

                {currentHistory.status === "new"
                  ? "Return form registered on " +
                    returnFormDate(request.dateSubmitted)
                  : currentHistory.status}
              </p>
              <ul
                className={
                  styles.statusUl +
                  " " +
                  (statusHistoryTimeline.length === i + 1
                    ? styles.statusUlLast
                    : "")
                }
              >
                {currentHistory.comments.map(comment => (
                  <li key={comment.id}>{comment.comment}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {this.renderStatusCommentForm()}
        <p className={"mt7"}>
          <strong>
            <FormattedMessage id={"admin/returns.statusHistory"} />
          </strong>
        </p>
        <div className={`flex flex-column items-stretch w-100`}>
          <div className={`flex flex-row items-stretch w-100`}>
            <div className={`flex w-33`}>
              <p className={styles.tableThParagraph}>
                <FormattedMessage id={"admin/returns.date"} />
              </p>
            </div>
            <div className={`flex w-33`}>
              <p className={styles.tableThParagraph}>
                <FormattedMessage id={"admin/returns.status"} />
              </p>
            </div>
            <div className={`flex w-33`}>
              <p className={styles.tableThParagraph}>
                <FormattedMessage id={"admin/returns.submittedBy"} />
              </p>
            </div>
          </div>
          {statusHistory.map((status, i) => (
            <div
              key={`statusHistoryTable_` + i}
              className={`flex flex-row items-stretch w-100`}
            >
              <div className={`flex w-33`}>
                <p>{returnFormDate(status.dateSubmitted)}</p>
              </div>
              <div className={`flex w-33`}>
                <p>{status.status}</p>
              </div>
              <div className={`flex w-33`}>
                <p>{status.submittedBy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

import React, { Component, useEffect } from "react";
import PropTypes from "prop-types";
import {
  returnFormDate,
  schemaTypes,
  requestsStatuses,
  statusHistoryTimeline,
  getCurrentDate,
  schemaNames,
  productStatuses, sendMail
} from "../common/utils";
import styles from "../styles.css";
import { FormattedMessage } from "react-intl";
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
  Button,
  Input
} from "vtex.styleguide";
import ProductsTable from "../components/ProductsTable";
import RequestInfo from "../components/RequestInfo";
import StatusHistoryTable from "../components/StatusHistoryTable";

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
      productsForm: [],
      initialProductsForm: [],
      statusHistory: [],
      statusHistoryTimeline: [],
      error: "",
      totalRefundAmount: 0,
      statusInput: "",
      commentInput: "",
      visibleInput: false,
      registeredUser: "",
      errorCommentMessage: "",
      showMain: true,
      showProductsForm: false
    };
  }

  componentDidMount(): void {
    this.getProfile().then();
    this.getFullData();
  }

  renderIcon = (product: any) => {
    if (product.status === requestsStatuses.approved) {
      return (
        <div>
          <span className={styles.statusApproved}>
            <IconSuccess size={14} /> {product.status}
          </span>
        </div>
      );
    }

    if (product.status === requestsStatuses.denied) {
      return (
        <div>
          <span className={styles.statusDenied}>
            <IconFailure size={14} /> {product.status}
          </span>
        </div>
      );
    }

    if (product.status === requestsStatuses.partiallyApproved) {
      return (
        <div>
          <span className={styles.statusPartiallyApproved}>
            <IconWarning size={14} /> {product.status}
          </span>
        </div>
      );
    }

    if (product.status === requestsStatuses.pendingVerification) {
      return (
        <div>
          <span className={styles.statusPendingVerification}>
            <IconClock size={14} /> {product.status}
          </span>
        </div>
      );
    }

    return (
      <div>
        <span className={styles.statusNew}>
          <IconVisibilityOn size={14} /> {product.status}
        </span>
      </div>
    );
  };

  getFullData() {
    const requestId = this.props["data"]["params"]["id"];
    this.getFromMasterData(
      schemaNames.request,
      schemaTypes.requests,
      requestId
    ).then(request => {
      this.setState({
        statusInput: request[0].status,
        commentInput: "",
        visibleInput: false
      });
      this.getFromMasterData(
        schemaNames.product,
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
            schemaNames.comment,
            schemaTypes.comments,
            requestId
          ).then(comments => {
            this.prepareHistoryData(comments, request[0]);
            this.getFromMasterData(
              schemaNames.history,
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
    const isRequest = schema === schemaNames.request;
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
        if (type === schemaTypes.products) {
          const productsForm: any = [];
          json.map(currentProduct => {
            let status = productStatuses.new;
            if (currentProduct.goodProducts === 0) {
              status = productStatuses.denied;
            } else if (currentProduct.goodProducts < currentProduct.quantity) {
              status = productStatuses.partiallyApproved;
            } else if (
              currentProduct.goodProducts === currentProduct.quantity
            ) {
              status = productStatuses.approved;
            }
            const updatedProduct = { ...currentProduct, status: status };
            productsForm.push(updatedProduct);
          });
          this.setState({
            productsForm: productsForm,
            initialProductsForm: productsForm
          });
        }
        return json;
      })
      .catch(err => this.setState({ error: err }));
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
      product,
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
        this.updateDocument(requestData.id, requestData);
        this.saveMasterData(schemaNames.history, statusHistoryData);
        if (
          request.status === requestsStatuses.new &&
          statusInput === requestsStatuses.pendingVerification
        ) {
          product.map(currentProduct => {
            const newProductInfo = {
              ...currentProduct,
              status: productStatuses.pendingVerification
            };
            this.updateDocument(newProductInfo.id, newProductInfo);
          });
        }
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
        this.saveMasterData(schemaNames.comment, commentData);
      }

      this.prepareHistoryData(oldComments, requestData);

      if (statusInput !== request.status) {
        window.setTimeout(() => {
          const { product, request, statusHistoryTimeline } = this.state;
          sendMail({
            data: { ...{ DocumentId: request.id }, ...request },
            products: product,
            timeline: statusHistoryTimeline
          });
        }, 2000);
      }
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

  handleQuantity(product: any, quantity: any) {
    const quantityInput = parseInt(quantity);
    let status = productStatuses.new;
    if (quantityInput == 0) {
      status = productStatuses.denied;
    } else if (quantityInput < product.quantity) {
      status = productStatuses.partiallyApproved;
    } else if (product.quantity === quantityInput) {
      status = productStatuses.approved;
    }

    this.setState(prevState => ({
      productsForm: prevState.productsForm.map(el =>
        el.id === product.id
          ? { ...el, goodProducts: quantityInput, status: status }
          : el
      )
    }));
  }

  verifyPackage() {
    const { request, productsForm } = this.state;
    let refundedAmount = 0;
    productsForm.map(currentProduct => {
      refundedAmount += currentProduct.goodProducts * currentProduct.unitPrice;
      this.updateDocument(currentProduct.id, currentProduct);
    });

    const updatedRequest = { ...request, refundedAmount: refundedAmount };
    this.updateDocument(request.id, updatedRequest);
    this.setState({
      showMain: true,
      showProductsForm: false,
      product: productsForm
    });
  }

  cancelProductsForm() {
    const { initialProductsForm } = this.state;
    this.setState({
      showMain: true,
      showProductsForm: false,
      productsForm: initialProductsForm
    });
  }

  allowedStatuses(status) {
    const { product } = this.state;
    const extractStatuses = {
      [productStatuses.new]: 0,
      [productStatuses.pendingVerification]: 0,
      [productStatuses.partiallyApproved]: 0,
      [productStatuses.approved]: 0,
      [productStatuses.denied]: 0
    };
    let totalProducts = 0;
    product.map(currentProduct => {
      extractStatuses[currentProduct.status] += 1;
      totalProducts += 1;
    });

    const currentStatus = status + " (current status)";
    let allowedStatuses: any = [{ label: currentStatus, value: status }];
    if (status === requestsStatuses.new) {
      allowedStatuses.push({
        label: requestsStatuses.pendingVerification,
        value: requestsStatuses.pendingVerification
      });
    }

    if (status === requestsStatuses.pendingVerification) {
      if (
        extractStatuses[productStatuses.new] > 0 ||
        extractStatuses[productStatuses.pendingVerification] > 0
      ) {
        // Caz in care cel putin un produs nu a fost verificat >> Pending Verification. Nu actionam
      } else if (extractStatuses[productStatuses.approved] === totalProducts) {
        // Caz in care toate sunt Approved >> Approved
        allowedStatuses.push({
          label: requestsStatuses.approved,
          value: requestsStatuses.approved
        });
      } else if (extractStatuses[productStatuses.denied] === totalProducts) {
        // Caz in care toate produsele sunt denied >> Denied
        allowedStatuses.push({
          label: requestsStatuses.denied,
          value: requestsStatuses.denied
        });
      } else if (
        (extractStatuses[productStatuses.approved] > 0 &&
          extractStatuses[productStatuses.approved] < totalProducts) ||
        extractStatuses[productStatuses.partiallyApproved] > 0
      ) {
        // Caz in care exista produse approved sau partiallyApproved si sau denied >> Partially Approved
        allowedStatuses.push({
          label: requestsStatuses.partiallyApproved,
          value: requestsStatuses.partiallyApproved
        });
      }
    }

    if (
      status === requestsStatuses.partiallyApproved ||
      status === requestsStatuses.approved
    ) {
      allowedStatuses = [
        { label: currentStatus, value: status },
        { label: requestsStatuses.refunded, value: requestsStatuses.refunded }
      ];
    }

    return allowedStatuses;
  }

  renderStatusCommentForm() {
    const {
      request,
      statusInput,
      commentInput,
      visibleInput,
      errorCommentMessage
    } = this.state;
    const statusesOptions = this.allowedStatuses(request.status);

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

  canVerifyPackage() {
    const { request } = this.state;
    return !(
      request.status === requestsStatuses.new ||
      request.status === requestsStatuses.refunded
    );
  }

  render() {
    const {
      request,
      product,
      productsForm,
      totalRefundAmount,
      statusHistoryTimeline,
      statusHistory,
      showMain,
      showProductsForm
    } = this.state;
    if (!request) {
      return <div>Not Found</div>;
    }

    if (showMain) {
      return (
        <div>
          <Button
            variation="primary"
            size="small"
            href="/admin/returns/requests"
          >
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
          {this.canVerifyPackage() ? (
            <Button
              size={"small"}
              onClick={() => {
                this.setState({ showMain: false, showProductsForm: true });
              }}
            >
              <FormattedMessage id={"admin/returns.verifyPackage"} />
            </Button>
          ) : null}

          <ProductsTable
            product={product}
            intlZone={"admin/returns"}
            totalRefundAmount={totalRefundAmount}
          />
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

          <RequestInfo request={request} />

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
          <StatusHistoryTable
            statusHistory={statusHistory}
            intlZone={"admin/returns"}
          />
        </div>
      );
    }

    if (showProductsForm) {
      return (
        <div>
          <div className={`mb4`}>
            <Button
              size={"small"}
              onClick={() => {
                this.cancelProductsForm();
              }}
            >
              <FormattedMessage id={"admin/returns.back"} />
            </Button>
          </div>
          <table className={styles.table + " " + styles.tableSm + " "}>
            <thead>
              <tr>
                <th>
                  <FormattedMessage id={"admin/returns.product"} />
                </th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {productsForm.length ? (
                productsForm.map(currentProduct => (
                  <tr key={currentProduct.skuId}>
                    <td className={styles.tableProductColumn}>
                      {currentProduct.skuName}
                    </td>
                    <td>
                      <Input
                        suffix={"/" + currentProduct.quantity}
                        size={"small"}
                        type={"number"}
                        value={currentProduct.goodProducts}
                        onChange={e => {
                          this.handleQuantity(currentProduct, e.target.value);
                        }}
                        max={currentProduct.quantity}
                        min={0}
                      />
                    </td>
                    <td className={styles.paddingLeft20}>
                      {this.renderIcon(currentProduct)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={styles.textCenter}>
                    <FormattedMessage id={"admin/returns.noProducts"} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className={`mt6`}>
            <Button
              size={`small`}
              variation={`primary`}
              onClick={() => {
                this.verifyPackage();
              }}
            >
              <FormattedMessage id={"admin/returns.verifyPackageButton"} />
            </Button>
          </div>
        </div>
      );
    }

    return null;
  }
}

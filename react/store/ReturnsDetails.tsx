import React, { Component } from "react";
import { ContentWrapper } from "vtex.my-account-commons";

import {
  productStatuses,
  returnFormDate,
  schemaNames,
  schemaTypes,
  prepareHistoryData,
  intlArea
} from "../common/utils";
import { Spinner } from "vtex.styleguide";
import { injectIntl, defineMessages } from "react-intl";
import RequestInfo from "../components/RequestInfo";
import StatusHistoryTable from "../components/StatusHistoryTable";
import ProductsTable from "../components/ProductsTable";
import { fetchHeaders, fetchMethod, fetchPath } from "../common/fetch";
import StatusHistoryTimeline from "../components/StatusHistoryTimeline";

import styles from "../styles.css";

const messages = defineMessages({
  notFound: { id: "returns.requestNotFound" },
  returnForm: { id: "returns.details.returnForm" },
  refOrder: { id: "returns.refOrder" },
  status: { id: "returns.status" }
});

class ReturnsDetails extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      request: {},
      comment: [],
      product: [],
      statusHistory: [],
      statusHistoryTimeline: [],
      error: "",
      totalRefundAmount: 0,
      giftCardValue: 0
    };
  }

  componentDidMount(): void {
    this.getProfile().then();
    this.getFullData();
  }

  getFullData() {
    const requestId = this.props["match"]["params"]["id"];
    this.getFromMasterData(
      schemaNames.request,
      schemaTypes.requests,
      requestId
    ).then(request => {
      if (request[0].giftCardId !== "") {
        this.getGiftCard(request[0].giftCardId).then();
      }
      this.setState({
        statusInput: request[0].status,
        commentInput: "",
        visibleInput: false,
        loading: false
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
            this.setState({
              statusHistoryTimeline: prepareHistoryData(comments, request[0])
            });
            this.getFromMasterData(
              schemaNames.history,
              schemaTypes.history,
              requestId
            ).then(() => {
              this.setState({ loading: false });
            });
          });
        }
      });
    });
  }

  async getProfile() {
    return await fetch(fetchPath.getProfile)
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

  async getGiftCard(id: any) {
    return await fetch(fetchPath.getGiftCard + id, {
      method: fetchMethod.get,
      headers: fetchHeaders
    })
      .then(response => response.json())
      .then(json => {
        if ("balance" in json) {
          this.setState({ giftCardValue: json.balance });
        }
      })
      .catch(err => this.setState({ error: err }));
  }

  async getFromMasterData(schema: string, type: string, refundId: string) {
    const isRequest = schema === schemaNames.request;
    const whereField = isRequest ? "id" : "refundId";

    if (type === schemaTypes.comments) {
      refundId += "__visibleForCustomer=1";
    }
    return await fetch(
      fetchPath.getDocuments +
        schema +
        "/" +
        type +
        "/" +
        whereField +
        "=" +
        refundId,
      {
        method: fetchMethod.get,
        headers: fetchHeaders
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

  render() {
    const {
      request,
      product,
      statusHistoryTimeline,
      statusHistory,
      loading,
      giftCardValue
    } = this.state;
    const { formatMessage } = this.props.intl;
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

          if (!request) {
            return <div>{formatMessage({ id: messages.notFound.id })}</div>;
          }
          return (
            <div>
              <p className={`${styles.requestInfoTitle}`}>
                <span className={`${styles.requestInfoTitleText}`}>
                  {formatMessage(
                    { id: messages.returnForm.id },
                    { requestId: " #" + request.id }
                  )}
                </span>
                <span className={`${styles.requestInfoTitleSeparator}`}>
                  {" "}
                  /{" "}
                </span>
                <span className={`${styles.requestInfoTitleDate}`}>
                  {returnFormDate(request.dateSubmitted)}
                </span>
              </p>
              <ProductsTable
                product={product}
                productsValue={request.totalPrice}
                totalRefundAmount={request.refundedAmount}
              />
              <p className={`mt7 ${styles.requestInfoOrder}`}>
                <strong className={`mr6 ${styles.requestInfoOrderText}`}>
                  {formatMessage(
                    { id: messages.refOrder.id },
                    { orderId: " #" + request.orderId }
                  )}
                </strong>
              </p>

              <RequestInfo giftCardValue={giftCardValue} request={request} />

              <p className={`mt7 ${styles.requestInfoSectionTitle}`}>
                <strong className={`${styles.requestInfoSectionTitleStrong}`}>
                  {formatMessage({ id: messages.status.id })}
                </strong>
              </p>

              <StatusHistoryTimeline
                statusHistoryTimeline={statusHistoryTimeline}
                intlZone={intlArea.store}
              />
              <StatusHistoryTable statusHistory={statusHistory} />
            </div>
          );
        }}
      </ContentWrapper>
    );
  }
}

export default injectIntl(ReturnsDetails);

import React, { Component } from "react";
import { ContentWrapper } from "vtex.my-account-commons";

import { PageProps } from "../typings/utils";
import {
  productStatuses,
  returnFormDate,
  schemaNames,
  schemaTypes,
  prepareHistoryData,
  FormattedMessageFixed,
  intlArea
} from "../common/utils";
import { Spinner } from "vtex.styleguide";
import { FormattedMessage } from "react-intl";
import RequestInfo from "../components/RequestInfo";
import StatusHistoryTable from "../components/StatusHistoryTable";
import ProductsTable from "../components/ProductsTable";
import { fetchHeaders, fetchMethod, fetchPath } from "../common/fetch";
import StatusHistoryTimeline from "../components/StatusHistoryTimeline";

import styles from "../styles.css";

class ReturnsDetails extends Component<PageProps, any> {
  constructor(props: PageProps) {
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
            this.setState({
              statusHistoryTimeline: prepareHistoryData(
                comments,
                request[0],
                "store/my-returns"
              )
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
            return (
              <div>
                <FormattedMessageFixed
                  id={"store/my-returns.requestNotFound"}
                />
              </div>
            );
          }
          return (
            <div>
              <p className={`${styles.requestInfoTitle}`}>
                <span className={`${styles.requestInfoTitleText}`}>
                  <FormattedMessage
                    id={"store/my-returns.details.returnForm"}
                    values={{
                      requestId: " #" + request.id
                    }}
                  />
                </span>
                <span className={`${styles.requestInfoTitleSeparator}`}>
                  {" "}
                  /{" "}
                </span>
                <span className={`${styles.requestInfoTitleDate}`}>
                  {returnFormDate(request.dateSubmitted, "store/my-returns")}
                </span>
              </p>
              <ProductsTable
                product={product}
                intl={intlArea.store}
                productsValue={request.totalPrice}
                totalRefundAmount={request.refundedAmount}
              />
              <p className={`mt7 ${styles.requestInfoOrder}`}>
                <strong className={`mr6 ${styles.requestInfoOrderText}`}>
                  <FormattedMessage
                    id={"store/my-returns.refOrder"}
                    values={{ orderId: " #" + request.orderId }}
                  />
                </strong>
              </p>

              <RequestInfo
                intl={intlArea.store}
                giftCardValue={giftCardValue}
                request={request}
              />

              <p className={`mt7 ${styles.requestInfoSectionTitle}`}>
                <strong className={`${styles.requestInfoSectionTitleStrong}`}>
                  <FormattedMessage id={"store/my-returns.status"} />
                </strong>
              </p>

              <StatusHistoryTimeline
                statusHistoryTimeline={statusHistoryTimeline}
                intl={intlArea.store}
              />
              <StatusHistoryTable
                statusHistory={statusHistory}
                intl={intlArea.store}
              />
            </div>
          );
        }}
      </ContentWrapper>
    );
  }
}

export default ReturnsDetails;

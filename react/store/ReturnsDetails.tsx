/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { Component } from 'react'
import { ContentWrapper } from 'vtex.my-account-commons'
import { Spinner, Button, Alert } from 'vtex.styleguide'
import { injectIntl, defineMessages } from 'react-intl'
import { Mutation } from 'react-apollo'

import {
  productStatuses,
  returnFormDate,
  schemaNames,
  schemaTypes,
  prepareHistoryData,
  intlArea,
  sendMail,
} from '../common/utils'
import RequestInfo from '../components/RequestInfo'
import StatusHistoryTable from '../components/StatusHistoryTable'
import ProductsTable from '../components/ProductsTable'
import { fetchHeaders, fetchMethod, fetchPath } from '../common/fetch'
import StatusHistoryTimeline from '../components/StatusHistoryTimeline'
import styles from '../styles.css'
import CREATE_LABEL from '../graphql/createLabel.gql'

const messages = defineMessages({
  notFound: { id: 'returns.requestNotFound' },
  returnForm: { id: 'returns.details.returnForm' },
  refOrder: { id: 'returns.refOrder' },
  status: { id: 'returns.status' },
  sendLabel: { id: 'returns.sendLabel' },
  shippingLabelSuccess: { id: 'returns.labelSuccess' },
  shippingLabelError: { id: 'returns.labelError' },
})

class ReturnsDetails extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      loading: true,
      request: {},
      comment: [],
      product: [],
      statusHistory: [],
      statusHistoryTimeline: [],
      error: '',
      totalRefundAmount: 0,
      giftCardValue: 0,
      showLabelSuccess: false,
      showLabelError: false,
      labelDisabled: false,
      shippingLabel: ''
    }
  }

  componentDidMount(): void {
    this.getProfile().then()
    this.getFullData()
  }

  getFullData() {
    const requestId = this.props.match.params.id

    this.getFromMasterData(
      schemaNames.request,
      schemaTypes.requests,
      requestId
    ).then((request) => {
      if (request[0].giftCardId !== '') {
        this.getGiftCard(request[0].giftCardId).then()
      }

      this.setState({
        statusInput: request[0].status,
        commentInput: '',
        visibleInput: false,
        loading: false,
      })

      this.getProductsFromMasterData(request[0].orderId, requestId).then(
        (response) => {
          let total = 0

          if (!response?.length) return

          response.forEach((currentProduct) => {
            total += currentProduct.quantity * currentProduct.unitPrice
          })
          this.setState({ totalRefundAmount: total })

          this.getFromMasterData(
            schemaNames.comment,
            schemaTypes.comments,
            requestId
          ).then((comments) => {
            this.setState({
              statusHistoryTimeline: prepareHistoryData(comments, request[0]),
            })
            this.getFromMasterData(
              schemaNames.history,
              schemaTypes.history,
              requestId
            ).then(() => {
              this.setState({ loading: false })
            })
          })
        }
      )
    })
  }

  async getProfile() {
    return fetch(fetchPath.getProfile)
      .then((response) => response.json())
      .then((response) => {
        if (response.IsUserDefined) {
          this.setState({
            registeredUser: `${response.FirstName} ${response.LastName}`,
          })
        }

        return Promise.resolve(response)
      })
  }

  async getGiftCard(id: any) {
    return fetch(`${fetchPath.getGiftCard}${id}`, {
      method: fetchMethod.get,
      headers: fetchHeaders,
    })
      .then((response) => response.json())
      .then((json) => {
        if ('balance' in json) {
          this.setState({ giftCardValue: json.balance })
        }
      })
      .catch((err) => this.setState({ error: err }))
  }

  async getFromMasterData(schema: string, type: string, refundId: string) {
    const isRequest = schema === schemaNames.request
    const whereField = isRequest ? 'id' : 'refundId'

    if (type === schemaTypes.comments) {
      refundId += '__visibleForCustomer=1'
    }

    return fetch(
      `${fetchPath.getDocuments + schema}/${type}/${whereField}=${refundId}`,
      {
        method: fetchMethod.get,
        headers: fetchHeaders,
      }
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({ [type]: isRequest ? json[0] : json })
        if (type === schemaTypes.products) {
          const productsForm: any = []

          json.forEach((currentProduct) => {
            let status = productStatuses.new

            if (currentProduct.goodProducts === 0) {
              status = productStatuses.denied
            } else if (currentProduct.goodProducts < currentProduct.quantity) {
              status = productStatuses.partiallyApproved
            } else if (
              currentProduct.goodProducts === currentProduct.quantity
            ) {
              status = productStatuses.approved
            }

            const updatedProduct = { ...currentProduct, status }

            productsForm.push(updatedProduct)
          })
          this.setState({
            productsForm,
            initialProductsForm: productsForm,
          })
        }

        return json
      })
      .catch((err) => this.setState({ error: err }))
  }

  async getProductsFromMasterData(orderId: string, returnId: string) {
    return fetch(
      `${fetchPath.getDocuments + schemaNames.product}/${
        schemaTypes.products
      }/orderId=${orderId}`,
      {
        method: fetchMethod.get,
        headers: fetchHeaders,
      }
    )
      .then((response) => response.json())
      .then((json) => {
        const refundableProducts = json.filter(
          (product) => product.refundId === returnId
        )

        this.setState({
          [schemaTypes.products]: refundableProducts,
        })
        const productsForm: any = []

        refundableProducts.forEach((currentProduct) => {
          let status = productStatuses.new

          if (currentProduct.goodProducts === 0) {
            status = productStatuses.denied
          } else if (currentProduct.goodProducts < currentProduct.quantity) {
            status = productStatuses.partiallyApproved
          } else if (currentProduct.goodProducts === currentProduct.quantity) {
            status = productStatuses.approved
          }

          const updatedProduct = { ...currentProduct, status }

          productsForm.push(updatedProduct)
        })

        this.setState({
          productsForm,
          initialProductsForm: productsForm,
        })

        return json
      })
      .catch((err) => this.setState({ error: err }))
  }

  createLabel = async (doMutation) => {
    this.setState({
      labelDisabled: true,
    })

    const { request } = this.state
    const variables = {
      street1: request.address,
      street2: '',
      city: request.locality,
      state: request.state,
      zip: request.zip,
      country: request.country,
      name: request.name,
      phone: request.phoneNumber,
    }

    let label: any

    try {
      label = await doMutation({
        variables: {
          street1: variables.street1,
          street2: variables.street2,
          city: variables.city,
          state: variables.state,
          zip: variables.zip,
          country: variables.country,
          name: variables.name,
          phone: variables.phone,
        },
      })
      const { labelUrl } = label.data.createLabel

      window.setTimeout(() => {
        const { product, statusHistoryTimeline } = this.state

        request.returnLabel = labelUrl
        sendMail({
          data: {
            ...{ DocumentId: request.id },
            ...request,
          },
          products: product,
          timeline: statusHistoryTimeline,
        })
      }, 2000)

      this.setState({
        showLabelSuccess: true,
        shippingLabel: labelUrl
      })
    } catch(e) {
      this.setState({
        showLabelError: true,
      })
    }
  }

  render() {
    const {
      request,
      product,
      statusHistoryTimeline,
      statusHistory,
      loading,
      giftCardValue,
    } = this.state

    const { formatMessage } = this.props.intl

    return (
      <ContentWrapper {...this.props.headerConfig}>
        {() => {
          if (loading) {
            return (
              <div className="flex justify-center pt6 pb6">
                <Spinner />
              </div>
            )
          }

          if (!request) {
            return <div>{formatMessage({ id: messages.notFound.id })}</div>
          }

          return (
            <div>
              <p className={`${styles.requestInfoTitle}`}>
                <span className={`${styles.requestInfoTitleText}`}>
                  {formatMessage(
                    { id: messages.returnForm.id },
                    { requestId: ` #${request.id}` }
                  )}
                </span>
                <span className={`${styles.requestInfoTitleSeparator}`}>
                  {' '}
                  /{' '}
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
                    { orderId: ` #${request.orderId}` }
                  )}
                </strong>
              </p>

              <RequestInfo giftCardValue={giftCardValue} request={request} />

              <div className="mt8">
              <Mutation mutation={CREATE_LABEL}>
                {(doMutation) => (
                  <Button
                    onClick={() => {
                      this.createLabel(doMutation)
                    }}
                    disabled={this.state.labelDisabled}
                  >
                    {formatMessage({
                      id: messages.sendLabel.id,
                    })}
                  </Button>
                )}
              </Mutation>
            </div>
            <div className="mt6">
              {this.state.showLabelSuccess && (
                <div>
                  <div className="mt6">
                    <Button variation="primary" href={this.state.shippingLabel} target="_blank">Print Label</Button>
                  </ div>
                  <div className="mt6">
                    <Alert type="success">
                      {formatMessage({
                        id: messages.shippingLabelSuccess.id,
                      })}
                    </Alert>
                  </ div>
                </ div>
              )}
              {this.state.showLabelError && (
                <Alert type="error">
                  {formatMessage({
                    id: messages.shippingLabelError.id,
                  })}
                </Alert>
              )}
            </div>

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
          )
        }}
      </ContentWrapper>
    )
  }
}

export default injectIntl(ReturnsDetails)

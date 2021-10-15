/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { Component } from 'react'
import { ContentWrapper } from 'vtex.my-account-commons'
import axios from 'axios'
import PropTypes from 'prop-types'
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
  static propTypes = {
    headerConfig: PropTypes.object,
    fetchApi: PropTypes.func,
  }

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
      shippingLabel: '',
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
    return this.props.fetchApi(fetchPath.getProfile).then((response) => {
      if (response.data.IsUserDefined) {
        this.setState({
          registeredUser: `${response.data.FirstName} ${response.data.LastName}`,
        })
      }

      return Promise.resolve(response.data)
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

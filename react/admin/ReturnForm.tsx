/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import { Mutation } from 'react-apollo'
import {
  Link,
  Dropdown,
  Checkbox,
  Textarea,
  Button,
  Input,
  Alert,
} from 'vtex.styleguide'

import {
  returnFormDate,
  schemaTypes,
  requestsStatuses,
  getCurrentDate,
  getOneYearLaterDate,
  schemaNames,
  productStatuses,
  renderIcon,
  prepareHistoryData,
  sendMail,
  intlArea,
  isInt,
  getProductStatusTranslation,
} from '../common/utils'
import styles from '../styles.css'
import ProductsTable from '../components/ProductsTable'
import RequestInfo from '../components/RequestInfo'
import StatusHistoryTable from '../components/StatusHistoryTable'
import { fetchHeaders, fetchMethod, fetchPath } from '../common/fetch'
import StatusHistoryTimeline from '../components/StatusHistoryTimeline'
import CREATE_LABEL from '../graphql/createLabel.gql'

const messages = defineMessages({
  statusCommentError: { id: 'returns.statusCommentError' },
  changeStatusComment: { id: 'returns.changeStatusComment' },
  addComment: { id: 'returns.addComment' },
  commentVisibleToClient: { id: 'returns.commentVisibleToClient' },
  addCommentButton: { id: 'returns.addCommentButton' },
  returnForm: { id: 'returns.details.returnForm' },
  verifyPackage: { id: 'returns.verifyPackage' },
  refOrder: { id: 'returns.refOrder' },
  viewOrder: { id: 'returns.viewOrder' },
  status: { id: 'returns.status' },
  verifyPackageButton: { id: 'returns.verifyPackageButton' },
  back: { id: 'returns.back' },
  product: { id: 'returns.product' },
  noProducts: { id: 'returns.noProducts' },
  sendLabel: { id: 'returns.sendLabel' },
  shippingLabelSuccess: { id: 'returns.labelSuccess' },
  shippingLabelError: { id: 'returns.labelError' },
})

class ReturnForm extends Component<any, any> {
  static propTypes = {
    data: PropTypes.object,
    intl: PropTypes.object,
  }

  constructor(props: any) {
    super(props)
    this.state = {
      request: {},
      comment: [],
      product: [],
      productsForm: [],
      initialProductsForm: [],
      statusHistory: [],
      statusHistoryTimeline: [],
      error: '',
      totalRefundAmount: 0,
      statusInput: '',
      commentInput: '',
      visibleInput: false,
      registeredUser: '',
      errorCommentMessage: '',
      giftCardValue: 0,
      showMain: true,
      showProductsForm: false,
      showLabelSuccess: false,
      showLabelError: false,
      labelDisabled: false,
    }
  }

  componentDidMount(): void {
    this.getProfile().then()
    this.getFullData()
  }

  getGiftCardInfo(request: any) {
    return `RA${request.id.split('-')[0]}`
  }

  async generateGiftCard(request: any) {
    const body = {
      relationName: this.getGiftCardInfo(request),
      caption: this.getGiftCardInfo(request),
      expiringDate: getOneYearLaterDate(),
      balance: 0,
      profileId: request.email,
      discount: true,
    }

    return fetch(fetchPath.createGiftCard, {
      method: fetchMethod.post,
      body: JSON.stringify(body),
      headers: fetchHeaders,
    })
      .then((response) => response.json())
      .then((json) => {
        return json
      })
  }

  async updateGiftCard(giftCardId: string, req: any) {
    const body = {
      description: 'Initial Charge',
      value: req.refundedAmount,
    }

    return fetch(fetchPath.updateGiftCard + giftCardId, {
      method: fetchMethod.post,
      body: JSON.stringify(body),
      headers: fetchHeaders,
    }).then((response) =>
      response.json().then((json) => {
        if ('balance' in json) {
          this.setState({ giftCardValue: json.balance / 100 })
        }
      })
    )
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

  getFullData() {
    const requestId = this.props.data.params.id

    this.getFromMasterData(
      schemaNames.request,
      schemaTypes.requests,
      requestId
    ).then((request) => {
      this.setState({
        statusInput: request[0].status,
        commentInput: '',
        visibleInput: false,
      })
      this.getProductsFromMasterData(request[0].orderId, requestId).then(
        (response) => {
          let total = 0

          if (!response.length) return
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
            ).then()
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

  async getFromMasterData(schema: string, type: string, refundId: string) {
    const isRequest = schema === schemaNames.request
    const whereField = isRequest ? 'id' : 'refundId'

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
        if (isRequest) {
          if (json[0].giftCardId !== '') {
            this.getGiftCard(json[0].giftCardId).then()
          }
        }

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

  submitStatusCommentForm() {
    this.setState({ errorCommentMessage: '' })
    const { formatMessage } = this.props.intl
    const {
      commentInput,
      visibleInput,
      statusInput,
      request,
      product,
      registeredUser,
      comment,
    } = this.state

    let requestData = request
    let oldComments = comment

    if (statusInput !== request.status || commentInput !== '') {
      if (statusInput !== request.status) {
        requestData = { ...requestData, status: statusInput }

        if (
          statusInput === requestsStatuses.refunded &&
          request.paymentMethod === 'giftCard'
        ) {
          this.generateGiftCard(requestData).then((json: any) => {
            const returnedId = json.id
            const exploded = returnedId.split('_')
            const giftCardId = exploded[exploded.length - 1]

            this.updateGiftCard(giftCardId, requestData).then()
            this.savePartial(schemaNames.request, {
              id: requestData.id,
              giftCardCode: json.redemptionCode,
              giftCardId,
            })

            this.setState((prevState) => ({
              request: {
                ...prevState.request,
                giftCardCode: json.redemptionCode,
                giftCardId,
              },
            }))
          })
        } else if (
          statusInput === requestsStatuses.refunded &&
          request.paymentMethod === 'card'
        ) {
          const items: any = []

          for (const item of this.state.product) {
            const invoiceItem = {
              id: item.sku,
              price: item.unitPrice,
              quantity: item.quantity,
            }

            items.push(invoiceItem)
          }

          const issuanceDate = new Date().toISOString().slice(0, 10)
          const invoiceNumber = this.state.request.id
          const invoiceValue = this.state.request.refundedAmount.toString()

          const body = {
            items,
            type: 'Input',
            issuanceDate,
            invoiceNumber,
            invoiceValue,
          }

          try {
            fetch(`${fetchPath.createRefund}${this.state.request.orderId}`, {
              method: fetchMethod.post,
              body: JSON.stringify(body),
              headers: fetchHeaders,
            })
            // .then((response) => {
            //   console.log(response)
            // })
          } catch {
            // console.log(e)
          }
        }

        const statusHistoryData = {
          refundId: request.id,
          status: statusInput,
          submittedBy: registeredUser,
          dateSubmitted: getCurrentDate(),
          type: schemaTypes.history,
        }

        const requestBody = requestData

        delete requestBody.giftCardCode
        delete requestBody.giftCardId
        this.savePartial(schemaNames.request, requestBody)
        this.saveMasterData(schemaNames.history, statusHistoryData)
        if (
          request.status === requestsStatuses.picked &&
          statusInput === requestsStatuses.pendingVerification
        ) {
          product.forEach((currentProduct) => {
            const newProductInfo = {
              ...currentProduct,
              status: productStatuses.pendingVerification,
            }

            this.saveMasterData(schemaNames.product, newProductInfo)
          })
        }

        this.setState((prevState) => ({
          request: {
            ...prevState.request,
            ...requestData,
          },
        }))
        this.setState((prevState) => ({
          statusHistory: [...prevState.statusHistory, statusHistoryData],
        }))
      }

      if (commentInput !== '') {
        const commentData = {
          refundId: request.id,
          status: statusInput,
          comment: commentInput,
          visibleForCustomer: visibleInput,
          submittedBy: registeredUser,
          dateSubmitted: getCurrentDate(),
          type: schemaTypes.comments,
        }

        oldComments = [...oldComments, commentData]
        this.setState({ comment: oldComments, commentInput: '' })
        this.saveMasterData(schemaNames.comment, commentData)
      }

      this.setState({
        statusHistoryTimeline: prepareHistoryData(oldComments, requestData),
      })
      if (
        statusInput !== request.status &&
        statusInput !== requestsStatuses.picked
      ) {
        window.setTimeout(() => {
          const { statusHistoryTimeline } = this.state

          sendMail({
            data: {
              ...{ DocumentId: request.id },
              ...request,
            },
            products: product,
            timeline: statusHistoryTimeline,
          })
        }, 2000)
      }
    } else {
      this.setState({
        errorCommentMessage: formatMessage({
          id: messages.statusCommentError.id,
        }),
      })
    }
  }

  saveMasterData = (schema: string, body: any) => {
    fetch(fetchPath.saveDocuments + schema, {
      method: fetchMethod.post,
      body: JSON.stringify(body),
      headers: fetchHeaders,
    }).then(() => {})
  }

  savePartial = (schema: string, body: any) => {
    fetch(fetchPath.savePartialDocument + schema, {
      method: fetchMethod.post,
      body: JSON.stringify(body),
      headers: fetchHeaders,
    }).then(() => {})
  }

  handleQuantity(product: any, quantity: any) {
    let quantityInput = parseInt(quantity, 10)
    let status = productStatuses.new

    if (!isInt(quantity)) {
      quantityInput = 0
    }

    if (quantityInput === 0) {
      status = productStatuses.denied
    } else if (quantityInput < product.quantity) {
      status = productStatuses.partiallyApproved
    } else if (product.quantity <= quantityInput) {
      status = productStatuses.approved
    }

    this.setState((prevState) => ({
      productsForm: prevState.productsForm.map((el) =>
        el.id === product.id
          ? {
              ...el,
              goodProducts:
                quantityInput > product.quantity
                  ? product.quantity
                  : quantityInput,
              status,
            }
          : el
      ),
    }))
  }

  verifyPackage() {
    const { request, productsForm } = this.state
    let refundedAmount = 0

    productsForm.forEach((currentProduct) => {
      refundedAmount += currentProduct.goodProducts * currentProduct.unitPrice
      this.saveMasterData(schemaNames.product, currentProduct)
    })

    const updatedRequest = { ...request, refundedAmount }

    this.saveMasterData(schemaNames.request, updatedRequest)
    this.setState({
      request: updatedRequest,
      showMain: true,
      showProductsForm: false,
      product: productsForm,
    })
  }

  cancelProductsForm() {
    const { initialProductsForm } = this.state

    this.setState({
      showMain: true,
      showProductsForm: false,
      productsForm: initialProductsForm,
    })
  }

  allowedStatuses(status) {
    const { product } = this.state
    const extractStatuses = {
      [productStatuses.new]: 0,
      [productStatuses.pendingVerification]: 0,
      [productStatuses.partiallyApproved]: 0,
      [productStatuses.approved]: 0,
      [productStatuses.denied]: 0,
    }

    let totalProducts = 0

    product.forEach((currentProduct) => {
      extractStatuses[currentProduct.status] += 1
      totalProducts += 1
    })

    const { formatMessage } = this.props.intl

    const currentStatus = formatMessage({
      id: `returns.status${getProductStatusTranslation(status)}`,
    })

    // const currentStatus = status + " (current status)";
    let allowedStatuses: any = [{ label: currentStatus, value: status }]

    if (status === requestsStatuses.new) {
      allowedStatuses.push({
        label: formatMessage({
          id: `returns.status${getProductStatusTranslation(
            requestsStatuses.picked
          )}`,
        }),
        value: requestsStatuses.picked,
      })
    }

    if (status === requestsStatuses.picked) {
      allowedStatuses.push({
        label: formatMessage({
          id: `returns.status${getProductStatusTranslation(
            requestsStatuses.pendingVerification
          )}`,
        }),
        value: requestsStatuses.pendingVerification,
      })
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
          label: formatMessage({
            id: `returns.status${getProductStatusTranslation(
              requestsStatuses.approved
            )}`,
          }),
          value: requestsStatuses.approved,
        })
      } else if (extractStatuses[productStatuses.denied] === totalProducts) {
        // Caz in care toate produsele sunt denied >> Denied
        allowedStatuses.push({
          label: formatMessage({
            id: `returns.status${getProductStatusTranslation(
              requestsStatuses.denied
            )}`,
          }),
          value: requestsStatuses.denied,
        })
      } else if (
        (extractStatuses[productStatuses.approved] > 0 &&
          extractStatuses[productStatuses.approved] < totalProducts) ||
        extractStatuses[productStatuses.partiallyApproved] > 0
      ) {
        // Caz in care exista produse approved sau partiallyApproved si sau denied >> Partially Approved
        allowedStatuses.push({
          label: formatMessage({
            id: `returns.status${getProductStatusTranslation(
              requestsStatuses.partiallyApproved
            )}`,
          }),
          value: requestsStatuses.partiallyApproved,
        })
      }
    }

    if (
      status === requestsStatuses.partiallyApproved ||
      status === requestsStatuses.approved
    ) {
      allowedStatuses = [
        { label: currentStatus, value: status },
        {
          label: formatMessage({
            id: `returns.status${getProductStatusTranslation(
              requestsStatuses.refunded
            )}`,
          }),
          value: requestsStatuses.refunded,
        },
      ]
    }

    return allowedStatuses
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
        // console.log(request)
      }, 2000)

      this.setState({
        showLabelSuccess: true,
      })
    } catch {
      this.setState({
        showLabelError: true,
      })
    }

    this.setState({
      labelDisabled: false,
    })
  }

  renderStatusCommentForm() {
    const {
      request,
      statusInput,
      commentInput,
      visibleInput,
      errorCommentMessage,
    } = this.state

    const { formatMessage } = this.props.intl
    const statusesOptions = this.allowedStatuses(request.status)

    return (
      <div>
        <p className="mt7">
          <strong className="mr6">
            {formatMessage({ id: messages.changeStatusComment.id })}
          </strong>
        </p>
        <div className="flex flex-row items-stretch">
          <div className="flex flex-column items-stretch w-50">
            <div className="mb6">
              <Dropdown
                size="small"
                options={statusesOptions}
                value={statusInput}
                onChange={(_, v: any) => this.setState({ statusInput: v })}
              />
            </div>
            <div className="mb6">
              <Textarea
                label={formatMessage({ id: messages.addComment.id })}
                value={commentInput}
                onChange={(e: any) =>
                  this.setState({ commentInput: e.target.value })
                }
              />
            </div>
            <div className="mb6">
              <Checkbox
                checked={visibleInput}
                id="visible-input"
                label={formatMessage({
                  id: messages.commentVisibleToClient.id,
                })}
                name="default-checkbox-group"
                onChange={() =>
                  this.setState((prevState) => ({
                    visibleInput: !prevState.visibleInput,
                  }))
                }
                value="1"
              />
            </div>
            <div>
              {errorCommentMessage ? (
                <div className="mb6">
                  <p className={styles.errorMessage}>{errorCommentMessage}</p>
                </div>
              ) : null}
              <Button onClick={() => this.submitStatusCommentForm()}>
                {formatMessage({
                  id: messages.addCommentButton.id,
                })}
              </Button>
            </div>
            <div className="mt6">
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
                <Alert type="success">
                  {formatMessage({
                    id: messages.shippingLabelSuccess.id,
                  })}
                </Alert>
              )}
              {this.state.showLabelError && (
                <Alert type="error">
                  {formatMessage({
                    id: messages.shippingLabelError.id,
                  })}
                </Alert>
              )}
            </div>
          </div>
          <div className="flex flex-column items-stretch w-50" />
        </div>
      </div>
    )
  }

  canVerifyPackage() {
    const { request } = this.state

    return request.status === requestsStatuses.pendingVerification
  }

  render() {
    const {
      request,
      product,
      productsForm,
      statusHistoryTimeline,
      statusHistory,
      showMain,
      showProductsForm,
      giftCardValue,
    } = this.state

    const { formatMessage } = this.props.intl

    if (!request) {
      return <div>Not Found</div>
    }

    if (showMain) {
      return (
        <div>
          <p>
            {formatMessage(
              { id: messages.returnForm.id },
              { requestId: ` #${request.id}` }
            )}

            {' / '}
            {returnFormDate(request.dateSubmitted)}
          </p>
          {this.canVerifyPackage() ? (
            <Button
              size="small"
              onClick={() => {
                this.setState({ showMain: false, showProductsForm: true })
              }}
            >
              {formatMessage({ id: messages.verifyPackage.id })}
            </Button>
          ) : null}

          <ProductsTable
            product={product}
            totalRefundAmount={request.refundedAmount}
            productsValue={request.totalPrice}
          />
          <p className="mt7">
            <strong className="mr6">
              {formatMessage(
                { id: messages.refOrder.id },
                { orderId: ` #${request.orderId}` }
              )}
            </strong>
            <Link
              href={`/admin/checkout/#/orders/${request.orderId}`}
              target="_blank"
            >
              {formatMessage({ id: messages.viewOrder.id })}
            </Link>
          </p>

          <RequestInfo request={request} giftCardValue={giftCardValue} />

          <p className="mt7">
            <strong>{formatMessage({ id: messages.status.id })}</strong>
          </p>

          <StatusHistoryTimeline
            statusHistoryTimeline={statusHistoryTimeline}
            intlZone={intlArea.admin}
          />
          {this.renderStatusCommentForm()}
          <StatusHistoryTable statusHistory={statusHistory} />
        </div>
      )
    }

    if (showProductsForm) {
      return (
        <div>
          <div className="mb4">
            <Button
              size="small"
              onClick={() => {
                this.cancelProductsForm()
              }}
            >
              {formatMessage({ id: messages.back.id })}
            </Button>
          </div>
          <table className={`${styles.table} ${styles.tableSm} `}>
            <thead>
              <tr>
                <th>{formatMessage({ id: messages.product.id })}</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {productsForm.length ? (
                productsForm.map((currentProduct) => (
                  <tr key={currentProduct.skuId}>
                    <td className={styles.tableProductColumn}>
                      {currentProduct.skuName}
                    </td>
                    <td className={styles.smallCell}>
                      <Input
                        suffix={`/${currentProduct.quantity}`}
                        size="small"
                        type="number"
                        value={currentProduct.goodProducts}
                        onChange={(e) => {
                          this.handleQuantity(currentProduct, e.target.value)
                        }}
                        max={currentProduct.quantity}
                        min={0}
                      />
                    </td>
                    <td
                      className={`${styles.paddingLeft20} ${styles.mediumCell}`}
                    >
                      {renderIcon(currentProduct)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={styles.textCenter}>
                    {formatMessage({ id: messages.noProducts.id })}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt6">
            <Button
              size="small"
              variation="primary"
              onClick={() => {
                this.verifyPackage()
              }}
            >
              {formatMessage({ id: messages.verifyPackageButton.id })}
            </Button>
          </div>
        </div>
      )
    }

    return null
  }
}

export default injectIntl(ReturnForm)

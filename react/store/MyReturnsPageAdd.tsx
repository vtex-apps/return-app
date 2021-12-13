/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ContentWrapper } from 'vtex.my-account-commons'
import { Button, Spinner } from 'vtex.styleguide'
import { defineMessages, injectIntl } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'

import {
  schemaTypes,
  requestsStatuses,
  schemaNames,
  sendMail,
  substractDays,
  getCurrentDate,
} from '../common/utils'
import { isValidIBANNumber } from '../common/validations'
import { countries } from '../common/countries'
import styles from '../styles.css'
import { fetchHeaders, fetchMethod, fetchPath } from '../common/fetch'
import EligibleOrdersTable from '../components/EligibleOrdersTable'
import RequestInformation from '../components/RequestInformation'
import RequestForm from '../components/RequestForm'

type Errors = {
  name: string
  email: string
  phone: string
  country: string
  locality: string
  address: string
  state: string
  zip: string
  paymentMethod: string
  iban: string
  accountHolder: string
  agree: string
  productQuantities: string
  reasonMissing: string
  condition: string
}

type State = {
  showForm: boolean
  showOrdersTable: boolean
  showInfo: boolean
  userId: string
  name: string
  email: string
  phone: string
  country: string
  state: string
  locality: string
  address: string
  zip: string
  paymentMethod: string
  iban: string
  accountHolder: string
  agree: boolean
  extraComment: string
  errorSubmit: any
  successSubmit: any
  errors: Errors
  eligibleOrders: string[]
  selectedOrderId: string
  selectedOrder: any[]
  orderProducts: any[]
  loading: boolean
  settings: any
  currentProduct: any
  submittedRequest: boolean
}

const initialErrors = {
  name: '',
  email: '',
  phone: '',
  country: '',
  locality: '',
  address: '',
  paymentMethod: '',
  iban: '',
  accountHolder: '',
  agree: '',
  productQuantities: '',
  reasonMissing: '',
  condition: '',
  state: '',
  zip: '',
}

const errorMessages = defineMessages({
  name: { id: 'returns.formErrorName' },
  email: { id: 'returns.formErrorEmail' },
  emailInvalid: { id: 'returns.formErrorEmailInvalid' },
  phone: { id: 'returns.formErrorPhone' },
  country: { id: 'returns.formErrorCountry' },
  locality: { id: 'returns.formErrorLocality' },
  state: { id: 'returns.formErrorState' },
  address: { id: 'returns.formErrorAddress' },
  zip: { id: 'returns.formErrorZip' },
  paymentMethod: { id: 'returns.formErrorPaymentMethod' },
  iban: { id: 'returns.formErrorIBAN' },
  accountHolder: { id: 'returns.formErroraccountHolder' },
  agree: { id: 'returns.formErrorAgree' },
  productQuantities: { id: 'returns.formErrorQuantities' },
  reasonMissing: { id: 'returns.formErrorReasonMissing' },
  condition: { id: 'returns.formErrorConditionMissing' },
})

const messages = defineMessages({
  submitSuccess: { id: 'returns.requestSubmitSuccess' },
  submitError: { id: 'returns.requestSubmitError' },
  backToOrders: { id: 'returns.backToOrders' },
})

const emailValidation = (email: string) => {
  return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  )
}

class MyReturnsPageAdd extends Component<any, State> {
  static propTypes = {
    headerConfig: PropTypes.object,
    fetchApi: PropTypes.func,
  }

  constructor(props: any & State) {
    super(props)
    this.state = {
      showOrdersTable: true,
      showForm: false,
      showInfo: false,
      userId: '',
      name: '',
      email: '',
      phone: '',
      country: '',
      locality: '',
      address: '',
      state: '',
      zip: '',
      paymentMethod: '',
      iban: '',
      accountHolder: '',
      agree: false,
      extraComment: '',
      successSubmit: '',
      errorSubmit: '',
      errors: initialErrors,
      eligibleOrders: [],
      selectedOrderId: '',
      selectedOrder: [],
      orderProducts: [],
      settings: {},
      loading: false,
      currentProduct: {},
      submittedRequest: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.selectOrder = this.selectOrder.bind(this)
  }

  async getSettings() {
    return fetch(
      `${fetchPath.getDocuments + schemaNames.settings}/${
        schemaTypes.settings
      }/1`,
      {
        method: fetchMethod.get,
        headers: fetchHeaders,
      }
    )
      .then((response) => response.json())
      .then((json) => {
        if (json?.[0]) {
          return Promise.resolve(json[0])
        }

        return Promise.resolve(null)
      })
  }

  async getProfile() {
    const { rootPath } = this.props.runtime
    const profileUrl = fetchPath.getProfile(rootPath)

    const profileResponse = await fetch(profileUrl)
    const profile = await profileResponse.json()

    if (profile.IsUserDefined) {
      this.setState({
        userId: profile.UserId,
        name:
          profile.FirstName && profile.LastName
            ? `${profile.FirstName} ${profile.LastName}`
            : '',
        email: profile.Email,
      })
    } else {
      const checkImpersonate = await fetch(`/api/sessions?items=*`)
      const impersonate = await checkImpersonate.json()

      if (!impersonate.namespaces.impersonate.canImpersonate.value) {
        return false
      }

      profile.Email = impersonate.namespaces.impersonate.storeUserEmail.value
    }

    return profile
  }

  async getSkuById(id: string) {
    return fetch(fetchPath.getSkuById + id, {
      method: fetchMethod.get,
      headers: fetchHeaders,
    })
  }

  async getOrders(userEmail: string, maxDays: any) {
    const currentDate = getCurrentDate()

    return fetch(
      `${
        fetchPath.getOrders
      }clientEmail=${userEmail}&orderBy=creationDate,desc&f_status=invoiced&f_creationDate=creationDate:[${substractDays(
        maxDays
      )} TO ${currentDate}]`
    )
      .then((response) => response.json())
      .then((res) => {
        return Promise.resolve(res)
      })
  }

  async getOrder(orderId: string) {
    return fetch(`${fetchPath.getOrder}${orderId}`)
      .then((response) => response.json())
      .then((res) => {
        return Promise.resolve(res)
      })
  }

  selectOrder(order) {
    this.prepareOrderData(order, this.state.settings, false)
    if (order.shippingData.address) {
      const complement =
        order.shippingData.address.complement !== null
          ? `, ${order.shippingData.address.complement}`
          : ''

      this.setState({
        country: countries[order.shippingData.address.country]
          ? countries[order.shippingData.address.country]
          : order.shippingData.address.country,
        locality: order.shippingData.address.city,
        address: `${order.shippingData.address.street} ${
          order.shippingData.address.number || ''
        }${complement}`,
        state: order.shippingData.address.state || '',
        zip: order.shippingData.address.postalCode || '',
      })
    }

    this.setState({
      selectedOrderId: order.orderId,
      phone: order.clientProfileData.phone,
      name: `${order.clientProfileData.firstName} ${order.clientProfileData.lastName}`,
      selectedOrder: order,
    })
    this.showForm()
  }

  prepareOrderData = (
    order: any,
    settings: any,
    updateEligibleOrders: boolean
  ) => {
    const thisOrder = order

    thisOrder.refunds = order.items.map((item, index) => ({
      ...item,
      itemIndex: index,
      totalProducts: item.quantity,
      reasonCode: '',
      reason: '',
      condition: '',
      selectedQuantity: 0,
      refundedPoducts: order.packageAttachment.packages
        .slice(1)
        .map((pack) => pack.items)
        .reduce((acc, el) => acc.concat(el), [])
        .filter((x) => x.itemIndex === index)
        .reduce((acc, el) => acc + el.quantity, 0),
    }))

    thisOrder.refunds = thisOrder.refunds
      .map((refund) => ({
        ...refund,
        quantity: refund.totalProducts - refund.refundedPoducts,
      }))
      .filter((item) => item.totalProducts - item.refundedPoducts !== 0)

    thisOrder.refundedProducts = order.packageAttachment.packages
      .slice(1) // exclude the first package
      .map((pack) => pack.items.reduce((acc, el) => acc + el.quantity, 0))
      .reduce((acc, el) => acc + el, 0)

    thisOrder.totalProducts = order.items.reduce(
      (acc, el) => acc + el.quantity,
      0
    )

    if (order.shippingData.address) {
      thisOrder.country = order.shippingData.address.country
      thisOrder.city = order.shippingData.address.city
      const complement =
        order.shippingData.address.complement !== null
          ? `, ${order.shippingData.address.complement}`
          : ''

      thisOrder.address = `${order.shippingData.address.street} ${order.shippingData.address.number}${complement}`
      thisOrder.state = order.shippingData.address.state || ''
      thisOrder.zip = order.shippingData.address.postalCode || ''
    }

    const promises = thisOrder.refunds.map((product: any) => {
      return new Promise((resolve) => {
        let categoryCount = 0
        let eligible = false
        const excludedCategories = JSON.parse(settings.excludedCategories)

        if (excludedCategories.length) {
          const { categories } = product.additionalInfo

          if (categories.length) {
            categories.forEach((category: any) => {
              const excludedMatch = excludedCategories.filter(
                (excl) => category.id === excl.id
              )

              if (excludedMatch.length) {
                categoryCount++
              }
            })
          }
        } else {
          eligible = true
        }

        eligible = !categoryCount

        const where = `orderId=${order.orderId}`

        let currentProduct = {
          ...product,
          selectedQuantity: 0,
        }

        this.checkProduct(where, product.refId)
          .then((response) => {
            currentProduct = {
              ...currentProduct,
              quantity: product.quantity - response,
            }
            if (response >= product.quantity) {
              eligible = false

              return eligible
            }

            return eligible
          })
          .then((isEligible) => {
            if (isEligible) {
              resolve(currentProduct)
            } else {
              resolve(false)
            }
          })
      })
    })

    Promise.all(promises)
      .then((eligibleProducts) => {
        const products = eligibleProducts.filter((i) => i)
        const previousOrders = this.state.eligibleOrders

        if (products.length) {
          if (updateEligibleOrders) {
            previousOrders.push(thisOrder)
            this.setState({
              eligibleOrders: previousOrders,
            })
          }
        }

        return { previousOrders, products }
      })
      .then(({ previousOrders, products }) => {
        this.setState({
          orderProducts: products,
          eligibleOrders: previousOrders,
        })

        setTimeout(() => {
          this.setState({ loading: false })
        }, 500)
      })
  }

  async checkProduct(where: string, productSkuId: string) {
    return fetch(
      `${fetchPath.getDocuments + schemaNames.product}/${
        schemaTypes.products
      }/${where}`
    )
      .then((response) => response.json())
      .then((response) => {
        let thisQuantity = 0

        if (response) {
          response.forEach((receivedProduct: any) => {
            receivedProduct.skuId === productSkuId &&
              (thisQuantity += +receivedProduct.quantity)
          })
        }

        return Promise.resolve(thisQuantity)
      })
  }

  prepareData = () => {
    this.setState({ loading: true })
    this.getSettings().then((settings) => {
      if (settings !== null) {
        this.setState({ settings })
        this.getProfile().then((user) => {
          this.getOrders(user.Email, settings.maxDays).then((orders) => {
            if ('list' in orders) {
              if (orders.list.length) {
                orders.list.forEach((order: any) => {
                  this.getOrder(order.orderId).then((currentOrder) => {
                    this.prepareOrderData(currentOrder, settings, true)
                  })
                })
                setTimeout(() => {
                  this.setState({ loading: false })
                }, 1000)
              } else {
                this.setState({ loading: false })
              }
            }
          })
        })
      } else {
        this.setState({ loading: false })
      }
    })
  }

  componentDidMount() {
    this.prepareData()
  }

  resetErrors() {
    this.setState({
      errors: initialErrors,
    })
  }

  validateForm() {
    let errors = false

    this.resetErrors()

    const {
      name,
      email,
      phone,
      country,
      locality,
      state,
      address,
      zip,
      paymentMethod,
      iban,
      accountHolder,
      agree,
      orderProducts,
    } = this.state

    if (!name) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          name: errorMessages.name.id,
        },
      }))
      errors = true
    }

    if (!email) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          email: errorMessages.email.id,
        },
      }))
      errors = true
    }

    if (email && !emailValidation(email)) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          email: errorMessages.emailInvalid.id,
        },
      }))
      errors = true
    }

    if (!phone) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          phone: errorMessages.phone.id,
        },
      }))
      errors = true
    }

    if (!country) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          country: errorMessages.country.id,
        },
      }))
      errors = true
    }

    if (!locality) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          locality: errorMessages.locality.id,
        },
      }))
      errors = true
    }

    if (!address) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          address: errorMessages.address.id,
        },
      }))
      errors = true
    }

    if (!paymentMethod) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          paymentMethod: errorMessages.paymentMethod.id,
        },
      }))
      errors = true
    } else if (paymentMethod === 'bank') {
      if (!iban || !isValidIBANNumber(iban)) {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            iban: errorMessages.iban.id,
          },
        }))
        errors = true
      }

      if (!accountHolder) {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            accountHolder: errorMessages.accountHolder.id,
          },
        }))
        errors = true
      }
    }

    if (!agree) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          agree: errorMessages.agree.id,
        },
      }))
      errors = true
    }

    let quantities = 0

    orderProducts.forEach((product: any) => {
      if (product.selectedQuantity === '') {
        quantities += 0
      } else {
        quantities += parseInt(product.selectedQuantity, 10)
      }

      const { reason } = product

      if (
        parseInt(product.selectedQuantity, 10) > 0 &&
        (product.reasonCode === '' ||
          (product.reasonCode === 'reasonOther' &&
            (product.reason === '' || !reason.replace(/\s/g, '').length)))
      ) {
        errors = true
      } else if (
        parseInt(product.selectedQuantity, 10) > 0 &&
        product.condition === ''
      ) {
        errors = true
      }
    })

    if (quantities === 0) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          productQuantities: errorMessages.productQuantities.id,
        },
      }))
      errors = true
    }

    return !errors
  }

  handleInputChange(event: any) {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target

    this.setState((prevState) => ({ ...prevState, [name]: value }))
  }

  submit() {
    if (this.validateForm()) {
      this.setState({
        showOrdersTable: false,
        showForm: false,
        showInfo: true,
      })
    }
  }

  showTable() {
    this.setState({
      showOrdersTable: true,
      showForm: false,
      showInfo: false,
    })
  }

  showForm() {
    this.resetErrors()
    this.setState({
      showOrdersTable: false,
      showForm: true,
      showInfo: false,
    })
  }

  handleQuantity(product: any, quantity: any) {
    this.setState((prevState) => ({
      orderProducts: prevState.orderProducts.map((el) =>
        el.uniqueId === product.uniqueId
          ? {
              ...el,
              selectedQuantity:
                quantity > product.quantity ? product.quantity : quantity,
            }
          : el
      ),
    }))
  }

  handleReasonCode(product: any, value: any) {
    this.setState((prevState) => ({
      orderProducts: prevState.orderProducts.map((el) =>
        el.uniqueId === product.uniqueId
          ? {
              ...el,
              reasonCode: value,
              reason: '',
            }
          : el
      ),
    }))
  }

  handleReason(product: any, value: any) {
    this.setState((prevState) => ({
      orderProducts: prevState.orderProducts.map((el) =>
        el.uniqueId === product.uniqueId
          ? {
              ...el,
              reason: value,
            }
          : el
      ),
    }))
  }

  handleCondition(product: any, value: any) {
    this.setState((prevState) => ({
      orderProducts: prevState.orderProducts.map((el) =>
        el.uniqueId === product.uniqueId
          ? {
              ...el,
              condition: value,
            }
          : el
      ),
    }))
  }

  sendRequest() {
    let totalPrice = 0

    this.setState({ errorSubmit: '' })
    const {
      userId,
      selectedOrderId,
      name,
      email,
      phone,
      country,
      state,
      locality,
      address,
      zip,
      paymentMethod,
      extraComment,
      iban,
      accountHolder,
      orderProducts,
    } = this.state

    orderProducts.forEach((product: any) => {
      totalPrice += product.selectedQuantity * product.sellingPrice
    })

    const requestData = {
      userId,
      orderId: selectedOrderId,
      name,
      email,
      phoneNumber: phone,
      country,
      locality,
      state,
      address,
      zip,
      paymentMethod,
      extraComment: encodeURIComponent(extraComment),
      totalPrice,
      refundedAmount: 0,
      giftCardCode: '',
      giftCardId: '',
      iban,
      accountHolder,
      status: requestsStatuses.new,
      dateSubmitted: getCurrentDate(),
      type: schemaTypes.requests,
    }

    const { formatMessage } = this.props.intl

    this.sendData(requestData, schemaNames.request).then((response) => {
      if ('DocumentId' in response) {
        this.addStatusHistory(response.DocumentId).then()
        this.submitProductRequest(response.DocumentId)
          .then(() => {
            this.setState({
              successSubmit: formatMessage({ id: messages.submitSuccess.id }),
              submittedRequest: true,
            })
            sendMail({
              data: { ...requestData, ...response },
              products: orderProducts,
            })
          })
          .then(() => {
            this.showTable()
          })
      } else {
        this.setState({
          errorSubmit: formatMessage({ id: messages.submitError.id }),
          submittedRequest: true,
        })
      }
    })
  }

  async addStatusHistory(DocumentId: string) {
    const { name } = this.state
    const bodyData = {
      submittedBy: name,
      refundId: DocumentId,
      status: requestsStatuses.new,
      dateSubmitted: getCurrentDate(),
      type: schemaTypes.history,
    }

    this.sendData(bodyData, schemaNames.history).then()
  }

  async submitProductRequest(DocumentId: string) {
    const { orderProducts, userId, selectedOrderId } = this.state

    orderProducts.forEach((product: any) => {
      if (parseInt(product.selectedQuantity, 10) > 0) {
        this.getSkuById(product.id)
          .then((response) => response.json())
          .then((skuResponse) => {
            const productData = {
              userId,
              orderId: selectedOrderId,
              refundId: DocumentId,
              skuId: product.refId ? product.refId : '',
              productId: product.productId,
              sku: product.id,
              manufacturerCode: skuResponse.ManufacturerCode
                ? skuResponse.ManufacturerCode
                : '',
              ean: product.ean ? product.ean : '',
              brandId: product.additionalInfo.brandId,
              brandName: product.additionalInfo.brandName,
              skuName: product.name,
              imageUrl: product.imageUrl,
              reasonCode: product.reasonCode,
              reason: product.reason,
              condition: product.condition,
              unitPrice: parseInt(product.sellingPrice, 10),
              quantity: parseInt(product.selectedQuantity, 10),
              totalPrice: parseInt(
                String(product.sellingPrice * product.selectedQuantity),
                10
              ),
              goodProducts: 0,
              status: requestsStatuses.new,
              dateSubmitted: getCurrentDate(),
              type: schemaTypes.products,
            }

            this.sendData(productData, schemaNames.product).then()
          })
      }
    })
  }

  async sendData(body: any, schema: string) {
    return fetch(fetchPath.saveDocuments + schema, {
      method: fetchMethod.post,
      body: JSON.stringify(body),
      headers: fetchHeaders,
    })
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        if (json) {
          return Promise.resolve(json)
        }

        return Promise.resolve(null)
      })
  }

  render() {
    const {
      showOrdersTable,
      showForm,
      showInfo,
      name,
      email,
      phone,
      country,
      locality,
      state,
      address,
      zip,
      paymentMethod,
      iban,
      accountHolder,
      extraComment,
      agree,
      errors,
      eligibleOrders,
      orderProducts,
      loading,
      errorSubmit,
      successSubmit,
      selectedOrder,
      submittedRequest,
      settings,
    }: any = this.state

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

          if (submittedRequest) {
            return (
              <div>
                {successSubmit ? (
                  <div className={styles.successContainer}>
                    <p className={styles.successMessage}>{successSubmit}</p>
                  </div>
                ) : null}
                <div className="flex flex-column items-center">
                  <span className="mb4">
                    <Button href="#/my-returns">
                      {formatMessage({ id: messages.backToOrders.id })}
                    </Button>
                  </span>
                </div>
              </div>
            )
          }

          return (
            <div>
              {showOrdersTable ? (
                <EligibleOrdersTable
                  eligibleOrders={eligibleOrders}
                  selectOrder={(order) => this.selectOrder(order)}
                />
              ) : null}
              {showForm ? (
                <RequestForm
                  settings={settings}
                  showTable={() => {
                    this.showTable()
                  }}
                  selectedOrder={selectedOrder}
                  orderProducts={orderProducts}
                  handleQuantity={(product, value) => {
                    this.handleQuantity(product, value)
                  }}
                  handleReasonCode={(product, value) => {
                    this.handleReasonCode(product, value)
                  }}
                  handleReason={(product, value) => {
                    this.handleReason(product, value)
                  }}
                  handleCondition={(product, value) => {
                    this.handleCondition(product, value)
                  }}
                  errors={errors}
                  handleInputChange={(e) => this.handleInputChange(e)}
                  formInputs={{
                    name,
                    email,
                    phone,
                    country,
                    locality,
                    state,
                    address,
                    zip,
                    extraComment,
                    paymentMethod,
                    iban,
                    accountHolder,
                    agree,
                  }}
                  submit={() => {
                    this.submit()
                  }}
                />
              ) : null}
              {showInfo ? (
                <RequestInformation
                  info={{
                    name,
                    email,
                    phone,
                    country,
                    state,
                    locality,
                    address,
                    zip,
                    paymentMethod,
                    iban,
                    accountHolder,
                    extraComment,
                  }}
                  orderProducts={orderProducts}
                  showForm={() => {
                    this.showForm()
                  }}
                  sendRequest={() => {
                    this.sendRequest()
                  }}
                  errorSubmit={errorSubmit}
                />
              ) : null}
            </div>
          )
        }}
      </ContentWrapper>
    )
  }
}

export default injectIntl(withRuntimeContext(MyReturnsPageAdd))

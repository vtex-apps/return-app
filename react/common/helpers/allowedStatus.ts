import {
  requestsStatuses,
  productStatuses,
  getProductStatusTranslation,
} from '../utils'

type Product = {
  brandId: string
  brandName: string
  condition: string
  createdIn: string
  dateSubmitted: string
  ean: string
  goodProducts: number
  id: string
  imageUrl: string
  manufacturerCode: string
  orderId: string
  productId: string
  quantity: number
  reason: string
  reasonCode: string
  refundId: string
  sku: string
  skuId: string
  skuName: string
  status: string
  tax: number
  totalPrice: number
  totalValue: number
  type: string
  unitPrice: number
  userId: string
}

type Status = typeof requestsStatuses[keyof typeof requestsStatuses]

type AllowedStatus = {
  status: Status
  product: Product[]
  formatMessage: ({ id }: { id: string }) => string
}
type StatusFormat = {
  label: string
  value: Status
}

/**
 *
 * @param param
 * @param param.formatMessage
 * @param param.status
 * @returns an object that contains the label and the value of the status.
 */
const statusFormat = ({
  formatMessage,
  status,
}: Pick<AllowedStatus, 'formatMessage' | 'status'>): StatusFormat => {
  return {
    label: formatMessage({
      id: `returns.status${getProductStatusTranslation(status)}`,
    }),
    value: status,
  }
}

/**
 * allowedStatusList - Returns the allowed status list for the given product
 * @param param.status is the status of the requests
 * @param param.product is product list
 * @param param.formatMessage callback function to get the translation of the status
 * @returns list of object with the status and value.
 */
function allowedStatusList({
  status,
  product,
  formatMessage,
}: AllowedStatus): StatusFormat[] {
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

  const currentStatus = formatMessage({
    id: `returns.status${getProductStatusTranslation(status)}`,
  })

  let allowedStatuses: StatusFormat[] = [
    { label: currentStatus, value: status },
  ]

  if (status === requestsStatuses.new) {
    allowedStatuses.push(
      statusFormat({ formatMessage, status: requestsStatuses.processing })
    )
    allowedStatuses.push(
      statusFormat({ formatMessage, status: requestsStatuses.picked })
    )
  }

  if (status === requestsStatuses.processing) {
    allowedStatuses.push(
      statusFormat({ formatMessage, status: requestsStatuses.picked })
    )
    allowedStatuses.push(
      statusFormat({ formatMessage, status: requestsStatuses.denied })
    )
  }

  if (status === requestsStatuses.picked) {
    allowedStatuses.push(
      statusFormat({
        formatMessage,
        status: requestsStatuses.pendingVerification,
      })
    )
  }

  if (status === requestsStatuses.new || status === requestsStatuses.picked) {
    allowedStatuses.push(
      statusFormat({ formatMessage, status: requestsStatuses.denied })
    )
  }

  if (status === requestsStatuses.pendingVerification) {
    if (
      extractStatuses[productStatuses.new] > 0 ||
      extractStatuses[productStatuses.pendingVerification] > 0
    ) {
      // Caz in care cel putin un produs nu a fost verificat >> Pending Verification. Nu actionam
      // In case at least one product has not been verified >> Pending Verification. We are not acting
    } else if (extractStatuses[productStatuses.approved] === totalProducts) {
      // Caz in care toate sunt Approved >> Approved
      // In case all are Approved >> Approved
      allowedStatuses.push(
        statusFormat({ formatMessage, status: requestsStatuses.approved })
      )
    } else if (extractStatuses[productStatuses.denied] === totalProducts) {
      // Caz in care toate produsele sunt denied >> Denied
      // In case all products are denied >> Denied
      allowedStatuses.push(
        statusFormat({ formatMessage, status: requestsStatuses.denied })
      )
    } else if (
      (extractStatuses[productStatuses.approved] > 0 &&
        extractStatuses[productStatuses.approved] < totalProducts) ||
      extractStatuses[productStatuses.partiallyApproved] > 0
    ) {
      // Caz in care exista produse approved sau partiallyApproved si sau denied >> Partially Approved
      // In case there are products approved or partiallyApproved and or denied >> Partially Approved
      allowedStatuses.push(
        statusFormat({
          formatMessage,
          status: requestsStatuses.partiallyApproved,
        })
      )
    }
  }

  if (
    status === requestsStatuses.partiallyApproved ||
    status === requestsStatuses.approved
  ) {
    allowedStatuses = [
      { label: currentStatus, value: status },
      statusFormat({ formatMessage, status: requestsStatuses.refunded }),
    ]
  }

  return allowedStatuses
}

export default allowedStatusList

export function formatRequest(request: any) {
  return {
    id: request.id,
    orderId: request.orderId,
    totalPrice: request.totalPrice,
    refundedAmount: request.refundedAmount,
    refundedShippingValue: request.refundedShippingValue,
    status: request.status,
    dateSubmitted: request.dateSubmitted,
    extraComment: request.extraComment,
    customerInfo: {
      name: request.name,
      email: request.email,
      phoneNumber: request.phoneNumber,
      country: request.country,
      locality: request.locality,
      address: request.address,
      state: request.state,
      zip: request.zip,
    },
    paymentInfo: {
      paymentMethod: request.paymentMethod,
      iban: request.iban,
      accountHolder: request.accountHolder,
      giftCardCode: request.giftCardCode,
      giftCardId: request.giftCardId,
    },
  }
}

export function formatProduct(product: any) {
  return {
    image: product.imageUrl,
    refId: product.skuId,
    skuId: product.sku,
    brandName: product.brandName,
    brandId: product.brandId,
    manufacturerCode: product.manufacturerCode,
    productId: product.productId,
    name: product.skuName,
    unitPrice: product.unitPrice,
    quantity: product.quantity,
    totalPrice: product.totalPrice,
    goodProducts: product.goodProducts,
    reasonCode: product.reasonCode,
    reasonText: product.reason,
    condition: product.condition,
    status: product.status,
  }
}

export function formatHistory(history: any) {
  return {
    status: history.status,
    dateSubmitted: history.dateSubmitted,
    submittedBy: history.submittedBy,
  }
}

export function formatComment(comment: any) {
  return {
    comment: comment.comment,
    visibleForCustomer: comment.visibleForCustomer,
    status: comment.status,
    dateSubmitted: comment.dateSubmitted,
    submittedBy: comment.submittedBy,
  }
}

export function currentDate() {
  const d = new Date()

  return `${d.getFullYear()}-${
    d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`
  }-${d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`}`
}

export function getCurrentDate() {
  return new Date().toISOString()
}

export function getOneYearLaterDate() {
  const d = new Date()
  const year = d.getFullYear()
  const month = d.getMonth()
  const day = d.getDate()
  const oneYearLater = new Date(year + 1, month, day)

  return oneYearLater.toISOString()
}

export function dateFilter(date: string, separator = '-') {
  const newDate = new Date(date)
  const day = newDate.getDate()
  const month = newDate.getMonth() + 1
  const year = newDate.getFullYear()

  return `${year}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${separator}${day < 10 ? `0${day}` : `${day}`}`
}

export const productStatuses = {
  new: 'New',
  pendingVerification: 'Pending verification',
  approved: 'Approved',
  partiallyApproved: 'Partially approved',
  denied: 'Denied',
}

export const requestsStatuses = {
  new: 'New',
  picked: 'Picked up from client',
  pendingVerification: 'Pending verification',
  approved: 'Approved',
  partiallyApproved: 'Partially approved',
  denied: 'Denied',
  refunded: 'Refunded',
}

export const statusHistoryTimelines = {
  new: 'new',
  picked: 'Picked up from client',
  pending: 'Pending verification',
  verified: 'Package verified',
  refunded: 'Amount refunded',
}

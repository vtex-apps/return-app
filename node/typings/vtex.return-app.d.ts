interface UserProfile {
  email: string
  userId: string
  firstName?: string
  lastName?: string
  role: 'admin' | 'store-user'
}

interface SessionData {
  id: string
  namespaces: {
    profile: ProfileSession
    authentication: AuthenticationSession
  }
}

interface ProfileSession {
  id?: {
    value: string
  }
  email?: {
    value: string
  }
  firstName?: {
    value: string
  }
  lastName?: {
    value: string
  }
}

interface AuthenticationSession {
  adminUserEmail?: {
    value: string
  }
  adminUserId?: {
    value: string
  }
}

interface OrderRefundDetails {
  id: string
  orderID: string
  initialInvoicedAmount: number
  totalRefunded?: number | undefined
  remainingRefundableAmount?: number | undefined
  amountToBeRefundedInProcess: number | undefined
  initialShippingCost?: number
  shippingCostToBeRefundedInProcess?: number | undefined
  totalShippingCostRefunded?: number | undefined
  remainingRefundableShippingCost?: number | undefined
  lastUpdated: Date
}

type RefundPaymentData = {
  transactionId?: string
  refundPaymentMethod: 'bank' | 'card' | 'giftCard' | 'sameAsPurchase'
}

interface Goodwill {
  orderId: string
  creditnoteID: string
  sellerId: string
  status: 'new' | 'processing' | 'amountRefunded'
  creditAmount: number
  reason: string
  refundPaymentData: RefundPaymentData
}

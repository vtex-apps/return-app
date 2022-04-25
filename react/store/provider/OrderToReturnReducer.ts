import type {
  CustomerProfileDataInput,
  PickupReturnDataInput,
  RefundPaymentDataInput,
  ReturnRequestInput,
} from 'vtex.return-app'

export const initialOrderToReturnState: ReturnRequestInput = {
  orderId: '',
  items: [],
  customerProfileData: {
    name: '',
    email: '',
    phoneNumber: '',
  },
  pickupReturnData: {
    addressId: 'ABC',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    addressType: 'CUSTOMER_ADDRESS' as const,
  },
  refundPaymentData: {
    refundPaymentMethod: 'sameAsPurchase' as const,
  },
  userComment: null,
}

export const costumerProfileDataAction = (
  customerProfileData: CustomerProfileDataInput
) => {
  return {
    type: 'updateCustomerProfileData' as const,
    payload: customerProfileData,
  }
}

export const pickupReturnDataAction = (
  pickupReturnData: PickupReturnDataInput
) => {
  return {
    type: 'updatePickupReturnData' as const,
    payload: pickupReturnData,
  }
}

export const refundPaymentDataAction = (
  refundPaymentData: RefundPaymentDataInput
) => {
  return {
    type: 'updateRefundPaymentData' as const,
    payload: refundPaymentData,
  }
}

export const userCommentAction = (userComment: string) => {
  return {
    type: 'updateUserComment' as const,
    payload: userComment,
  }
}

export const newReturnRequestState = ({
  orderId,
  customerProfileData,
  pickupReturnData,
  refundPaymentData,
}: {
  orderId: string
  customerProfileData: CustomerProfileDataInput
  pickupReturnData: PickupReturnDataInput
  refundPaymentData: RefundPaymentDataInput
}) => {
  return {
    type: 'newReturnRequestState' as const,
    payload: {
      orderId,
      customerProfileData,
      pickupReturnData,
      refundPaymentData,
    },
  }
}

export type ReturnRequestActions =
  | ReturnType<typeof costumerProfileDataAction>
  | ReturnType<typeof pickupReturnDataAction>
  | ReturnType<typeof refundPaymentDataAction>
  | ReturnType<typeof userCommentAction>
  | ReturnType<typeof newReturnRequestState>

export const orderToReturnReducer = (
  state: ReturnRequestInput,
  action: ReturnRequestActions
) => {
  switch (action.type) {
    case 'updateCustomerProfileData': {
      return {
        ...state,
        customerProfileData: action.payload,
      }
    }

    case 'updatePickupReturnData': {
      return {
        ...state,
        pickupReturnData: action.payload,
      }
    }

    case 'updateRefundPaymentData': {
      return {
        ...state,
        refundPaymentData: action.payload,
      }
    }

    case 'updateUserComment': {
      return {
        ...state,
        userComment: action.payload,
      }
    }

    case 'newReturnRequestState': {
      return {
        orderId: action.payload.orderId,
        customerProfileData: action.payload.customerProfileData,
        pickupReturnData: action.payload.pickupReturnData,
        refundPaymentData: action.payload.refundPaymentData,
        items: [],
      }
    }

    default: {
      return state
    }
  }
}

import type {
  CustomerProfileDataInput,
  PickupReturnDataInput,
  RefundPaymentDataInput,
  ReturnRequestItemInput,
  Maybe,
} from 'vtex.return-app'

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export interface OrderDetailsState {
  orderId: string
  items: Array<PartialBy<ReturnRequestItemInput, 'condition' | 'returnReason'>>
  customerProfileData: CustomerProfileDataInput
  pickupReturnData: PickupReturnDataInput
  refundPaymentData?: RefundPaymentDataInput
  userComment?: Maybe<string> | undefined
}

export const initialOrderToReturnState: OrderDetailsState = {
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
  userComment: null,
}

const costumerProfileDataAction = (
  customerProfileData: CustomerProfileDataInput
) => {
  return {
    type: 'updateCustomerProfileData' as const,
    payload: customerProfileData,
  }
}

const pickupReturnDataAction = (pickupReturnData: PickupReturnDataInput) => {
  return {
    type: 'updatePickupReturnData' as const,
    payload: pickupReturnData,
  }
}

const refundPaymentDataAction = (refundPaymentData: RefundPaymentDataInput) => {
  return {
    type: 'updateRefundPaymentData' as const,
    payload: refundPaymentData,
  }
}

const userCommentAction = (userComment: string) => {
  return {
    type: 'updateUserComment' as const,
    payload: userComment,
  }
}

const itemsAction = (items: OrderDetailsState['items']) => {
  return {
    type: 'updateItems' as const,
    payload: items,
  }
}

export const newReturnRequestState = ({
  orderId,
  customerProfileData,
  pickupReturnData,
  items,
}: OrderDetailsState) => {
  return {
    type: 'newReturnRequestState' as const,
    payload: {
      orderId,
      customerProfileData,
      pickupReturnData,
      items,
    },
  }
}

export type ReturnRequestActions =
  | ReturnType<typeof costumerProfileDataAction>
  | ReturnType<typeof pickupReturnDataAction>
  | ReturnType<typeof refundPaymentDataAction>
  | ReturnType<typeof userCommentAction>
  | ReturnType<typeof newReturnRequestState>
  | ReturnType<typeof itemsAction>

export const orderToReturnReducer = (
  state: OrderDetailsState,
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

    case 'updateItems': {
      return {
        ...state,
        items: action.payload,
      }
    }

    case 'newReturnRequestState': {
      return {
        orderId: action.payload.orderId,
        customerProfileData: action.payload.customerProfileData,
        pickupReturnData: action.payload.pickupReturnData,
        items: action.payload.items,
      }
    }

    default: {
      return state
    }
  }
}

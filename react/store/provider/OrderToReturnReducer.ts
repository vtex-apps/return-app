import type {
  CustomerProfileDataInput,
  PickupReturnDataInput,
  RefundPaymentDataInput,
  ReturnRequestItemInput,
  Maybe,
} from '../../../typings/ReturnRequest'

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// When adding PartialBy in a field, it's necessary to the validation in the function isReturnRequestArgs
export interface OrderDetailsState {
  orderId: string
  items: Array<PartialBy<ReturnRequestItemInput, 'condition' | 'returnReason'>>
  customerProfileData: CustomerProfileDataInput
  pickupReturnData: PartialBy<PickupReturnDataInput, 'addressType'>
  refundPaymentData?: RefundPaymentDataInput
  userComment?: Maybe<string> | undefined
}

const initialPickupReturnData = {
  addressId: '',
  address: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
}

export const initialOrderToReturnState: OrderDetailsState = {
  orderId: '',
  items: [],
  customerProfileData: {
    name: '',
    email: '',
    phoneNumber: '',
  },
  pickupReturnData: initialPickupReturnData,
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

const pickupReturnDataAction = (
  pickupReturnData: OrderDetailsState['pickupReturnData']
) => {
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
  refundPaymentData,
}: OrderDetailsState) => {
  return {
    type: 'newReturnRequestState' as const,
    payload: {
      orderId,
      customerProfileData,
      pickupReturnData,
      items,
      refundPaymentData,
    },
  }
}

const resetAddress = () => ({
  type: 'resetAddress' as const,
})

export type ReturnRequestActions =
  | ReturnType<typeof costumerProfileDataAction>
  | ReturnType<typeof pickupReturnDataAction>
  | ReturnType<typeof refundPaymentDataAction>
  | ReturnType<typeof userCommentAction>
  | ReturnType<typeof newReturnRequestState>
  | ReturnType<typeof itemsAction>
  | ReturnType<typeof resetAddress>

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

    case 'resetAddress': {
      return {
        ...state,
        pickupReturnData: initialPickupReturnData,
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
        refundPaymentData: action.payload.refundPaymentData,
      }
    }

    default: {
      return state
    }
  }
}

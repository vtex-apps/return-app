import type {
  CustomReturnReason,
  PaymentOptions,
  ReturnOption,
} from '../../../../typings/ReturnAppSettings'
import type { SellerSetting } from '../../../../typings/SellerSetting'

export const initialSettingsState: SellerSetting = {
  id: '',
  sellerId: '',
  maxDays: 0,
  enableStatusSelection: true,
  excludedCategories: [],
  termsUrl: '',
  orderStatus: 'Select Option',
  paymentOptions: {
    enablePaymentMethodSelection: false,
    allowedPaymentTypes: {
      bank: false,
      card: false,
      giftCard: false,
    },
  },
  customReturnReasons: [],
  options: {
    enableOtherOptionSelection: false,
    enablePickupPoints: false,
    enableProportionalShippingValue: false,
    enableSelectItemCondition: false,
  },
}

export const maxDaysAction = (maxDays: number) => {
  return {
    type: 'updateMaxDays' as const,
    payload: maxDays,
  }
}

export const orderStatusAction = (orderStatus: string) => {
  return {
    type: 'updateOrderStatus' as const,
    payload: orderStatus,
  }
}

export const excludedCategoriesAction = (excludedCategories: string[]) => {
  return {
    type: 'updateExcludedCategories' as const,
    payload: excludedCategories,
  }
}

export const termsUrlAction = (termsUrl: string) => {
  return {
    type: 'updateTermsUrl' as const,
    payload: termsUrl,
  }
}

export const statusAction = (enableStatusSelection: boolean) => {
  return {
    type: 'updateStatus' as const,
    payload: enableStatusSelection,
  }
}

export const paymentOptionsAction = (paymentOptions: PaymentOptions) => {
  return {
    type: 'updatePaymentOptions' as const,
    payload: paymentOptions,
  }
}

export const customReturnReasonsAction = (
  customReturnReasons: CustomReturnReason[]
) => {
  return {
    type: 'updateCustomReturnReasons' as const,
    payload: customReturnReasons,
  }
}

export const optionsAction = (options: ReturnOption) => {
  return {
    type: 'updateOptions' as const,
    payload: options,
  }
}


export const initialStateAction = (
  initialState: SellerSetting
) => {
  return {
    type: 'updateInitialState' as const,
    payload: initialState,
  }
}

export const initialStateActionSeller = (
  initialStateSeller: SellerSetting
) => {
  return {
    type: 'updateInitialStateSeller' as const,
    payload: initialStateSeller,
  }
}

export type Actions =
  | ReturnType<typeof maxDaysAction>
  | ReturnType<typeof orderStatusAction>
  | ReturnType<typeof excludedCategoriesAction>
  | ReturnType<typeof termsUrlAction>
  | ReturnType<typeof statusAction>
  | ReturnType<typeof paymentOptionsAction>
  | ReturnType<typeof customReturnReasonsAction>
  | ReturnType<typeof optionsAction>
  | ReturnType<typeof initialStateAction>
  | ReturnType<typeof initialStateActionSeller>

export const settingsReducer = (
  state: SellerSetting,
  action: Actions
) => {
  switch (action.type) {
    case 'updateMaxDays': {
      return {
        ...state,
        maxDays: action.payload,
      }
    }

    case 'updateOrderStatus': {
      return {
        ...state,
        orderStatus: action.payload,
      }
    }

    case 'updateExcludedCategories': {
      return {
        ...state,
        excludedCategories: action.payload,
      }
    }

    case 'updateTermsUrl': {
      return {
        ...state,
        termsUrl: action.payload,
      }
    }

    case 'updateStatus': {
      return {
        ...state,
        enableStatusSelection: action.payload,
      }
    }
    case 'updatePaymentOptions': {
      return {
        ...state,
        paymentOptions: action.payload,
      }
    }

    case 'updateCustomReturnReasons': {
      return {
        ...state,
        customReturnReasons: action.payload,
      }
    }

    case 'updateOptions': {
      return {
        ...state,
        options: action.payload,
      }
    }

    case 'updateInitialState': {
      return action.payload
    }

    case 'updateInitialStateSeller': {
      return action.payload
    }

    default: {
      return state
    }
  }
}

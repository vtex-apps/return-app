import type {
  CustomReturnReason,
  PaymentOptions,
  ReturnAppSettings,
  ReturnOption,
} from 'vtex.return-app'

export const initialSettingsState: ReturnAppSettings = {
  maxDays: 0,
  excludedCategories: [],
  termsUrl: '',
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

export const initialStateAction = (initialState: ReturnAppSettings) => {
  return {
    type: 'updateInitialState' as const,
    payload: initialState,
  }
}

export type Actions =
  | ReturnType<typeof maxDaysAction>
  | ReturnType<typeof excludedCategoriesAction>
  | ReturnType<typeof termsUrlAction>
  | ReturnType<typeof paymentOptionsAction>
  | ReturnType<typeof customReturnReasonsAction>
  | ReturnType<typeof optionsAction>
  | ReturnType<typeof initialStateAction>

export const settingsReducer = (state: ReturnAppSettings, action: Actions) => {
  switch (action.type) {
    case 'updateMaxDays': {
      return {
        ...state,
        maxDays: action.payload,
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

    default: {
      return state
    }
  }
}

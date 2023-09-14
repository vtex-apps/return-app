import type { Dispatch, FC, SetStateAction } from 'react'
import React, { createContext, useReducer, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import type {
  ReturnRequestActions,
  OrderDetailsState,
} from './OrderToReturnReducer'
import {
  initialOrderToReturnState,
  orderToReturnReducer,
} from './OrderToReturnReducer'
import type { ErrorsValidation } from '../utils/validateNewReturnRequestFields'
import { validateNewReturnRequestFields } from '../utils/validateNewReturnRequestFields'
import { useStoreSettings } from '../hooks/useStoreSettings'

interface OrderToReturnContextInterface {
  returnRequest: OrderDetailsState
  inputErrors: ErrorsValidation[]
  termsAndConditions: boolean
  actions: {
    updateReturnRequest: Dispatch<ReturnRequestActions>
    areFieldsValid: () => boolean
    toogleTermsAndConditions: Dispatch<SetStateAction<boolean>>
  }
}

export const OrderToReturnContext =
  createContext<OrderToReturnContextInterface>(
    {} as OrderToReturnContextInterface
  )

export const OrderToReturnProvider: FC = ({ children }) => {
  const [returnRequest, updateReturnRequest] = useReducer(
    orderToReturnReducer,
    initialOrderToReturnState
  )

  const { data: storeSettings } = useStoreSettings()
  const { options } = storeSettings ?? {}
  const { enableSelectItemCondition } = options ?? {}

  const [termsAndConditions, setTermsAndConditions] = useState(false)

  const [inputErrors, setInputErrors] = useState<ErrorsValidation[]>([])

  const {
    culture: { locale },
  } = useRuntime()

  const areFieldsValid = (): boolean => {
    const { errors } = validateNewReturnRequestFields(returnRequest, {
      termsAndConditionsAccepted: termsAndConditions,
      locale,
      considerItemCondition: Boolean(enableSelectItemCondition),
    })

    if (errors) {
      setInputErrors(errors)

      return false
    }

    setInputErrors([])

    return true
  }

  return (
    <OrderToReturnContext.Provider
      value={{
        returnRequest,
        inputErrors,
        termsAndConditions,
        actions: {
          updateReturnRequest,
          areFieldsValid,
          toogleTermsAndConditions: setTermsAndConditions,
        },
      }}
    >
      {children}
    </OrderToReturnContext.Provider>
  )
}

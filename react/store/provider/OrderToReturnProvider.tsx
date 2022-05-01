import type { Dispatch, FC, SetStateAction } from 'react'
import React, { createContext, useReducer, useState } from 'react'
import type { ReturnRequestInput } from 'vtex.return-app'

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

interface OrderToReturnContextInterface {
  returnRequest: OrderDetailsState
  validatedRmaFields: ReturnRequestInput | null
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

  const [termsAndConditions, setTermsAndConditions] = useState(false)

  const [inputErrors, setInputErrors] = useState<ErrorsValidation[]>([])
  const [validatedRmaFields, setValidatedRmaFields] =
    useState<ReturnRequestInput | null>(null)

  const areFieldsValid = (): boolean => {
    const { errors, validatedFields } = validateNewReturnRequestFields(
      termsAndConditions,
      returnRequest
    )

    if (errors) {
      setValidatedRmaFields(null)
      setInputErrors(errors)

      return false
    }

    setInputErrors([])
    setValidatedRmaFields(validatedFields)

    return true
  }

  return (
    <OrderToReturnContext.Provider
      value={{
        returnRequest,
        validatedRmaFields,
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

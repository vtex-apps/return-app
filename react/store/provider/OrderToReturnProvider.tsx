import type { Dispatch, FC } from 'react'
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
  actions: {
    updateReturnRequest: Dispatch<ReturnRequestActions>
    areFieldsValid: () => boolean
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

  const [inputErrors, setInputErrors] = useState<ErrorsValidation[]>([])
  const [validatedRmaFields, setValidatedRmaFields] =
    useState<ReturnRequestInput | null>(null)

  const areFieldsValid = (): boolean => {
    const { errors, validatedFields } =
      validateNewReturnRequestFields(returnRequest)

    if (errors) {
      setValidatedRmaFields(null)
      setInputErrors(errors)

      return false
    }

    setInputErrors([])
    setValidatedRmaFields(validatedFields)

    return true
  }

  // eslint-disable-next-line no-console
  console.log({ inputErrors })

  return (
    <OrderToReturnContext.Provider
      value={{
        returnRequest,
        validatedRmaFields,
        inputErrors,
        actions: { updateReturnRequest, areFieldsValid },
      }}
    >
      {children}
    </OrderToReturnContext.Provider>
  )
}

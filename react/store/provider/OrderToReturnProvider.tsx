import type { Dispatch, FC } from 'react'
import React, { createContext, useReducer } from 'react'
import type { ReturnRequestInput } from 'vtex.return-app'

import type { ReturnRequestActions } from './OrderToReturnReducer'
import {
  initialOrderToReturnState,
  orderToReturnReducer,
} from './OrderToReturnReducer'

interface OrderToReturnContextInterface {
  returnRequest: ReturnRequestInput
  actions: {
    updateReturnRequest: Dispatch<ReturnRequestActions>
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

  return (
    <OrderToReturnContext.Provider
      value={{ returnRequest, actions: { updateReturnRequest } }}
    >
      {children}
    </OrderToReturnContext.Provider>
  )
}

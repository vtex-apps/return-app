import type { Dispatch, FC } from 'react'
import React, { createContext, useReducer } from 'react'

import type {
  ReturnRequestActions,
  OrderDetailsState,
} from './OrderToReturnReducer'
import {
  initialOrderToReturnState,
  orderToReturnReducer,
} from './OrderToReturnReducer'

interface OrderToReturnContextInterface {
  returnRequest: OrderDetailsState
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
